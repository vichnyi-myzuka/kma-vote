import { SelectQueryBuilder, TypeORMError } from 'typeorm';

export default class<T> extends SelectQueryBuilder<T> {
  getQuery() {
    //this.createSqlParameters();
    let sql = this.createWrapper();
    sql += this.createComment();
    sql += this.createCteExpression();
    sql += this.createSelectExpression();
    sql += this.createJoinExpression();
    sql += this.createWhereExpression();
    sql += this.createGroupByExpression();
    sql += this.createHavingExpression();
    sql += this.createOrderByExpression();
    sql += this.createWrapperEnding();
    sql += this.createLimitOffsetExpression();
    sql = sql.trim();
    if (this.expressionMap.subQuery) sql = '(' + sql + ')';
    return sql;
  }
  createWrapper() {
    return 'WITH cols AS (';
  }

  createWrapperEnding() {
    return ') SELECT * FROM cols';
  }

  /**
   * Creates "SELECT FROM" part of SQL query.
   */
  createSelectExpression() {
    if (!this.expressionMap.mainAlias)
      throw new TypeORMError(
        'Cannot build query because main alias is not set (call qb#from method)',
      );
    // todo throw exception if selects or from is missing
    const allSelects = [];
    const excludedSelects = [];
    if (this.expressionMap.mainAlias.hasMetadata) {
      const metadata = this.expressionMap.mainAlias.metadata;
      allSelects.push(
        ...this.buildEscapedEntityColumnSelects(
          this.expressionMap.mainAlias.name,
          metadata,
        ),
      );
      excludedSelects.push(
        ...this.findEntityColumnSelects(
          this.expressionMap.mainAlias.name,
          metadata,
        ),
      );
    }
    // add selects from joins
    this.expressionMap.joinAttributes.forEach((join) => {
      if (join.metadata) {
        allSelects.push(
          ...this.buildEscapedEntityColumnSelects(
            join.alias.name,
            join.metadata,
          ),
        );
        excludedSelects.push(
          ...this.findEntityColumnSelects(join.alias.name, join.metadata),
        );
      } else {
        const hasMainAlias = this.expressionMap.selects.some(
          (select) => select.selection === join.alias.name,
        );
        if (hasMainAlias) {
          allSelects.push({
            selection: this.escape(join.alias.name) + '.*',
          });
          const excludedSelect = this.expressionMap.selects.find(
            (select) => select.selection === join.alias.name,
          );
          excludedSelects.push(excludedSelect);
        }
      }
    });
    // add all other selects
    this.expressionMap.selects
      .filter((select) => excludedSelects.indexOf(select) === -1)
      .forEach((select) =>
        allSelects.push({
          selection: this.replacePropertyNames(select.selection),
          aliasName: select.aliasName,
        }),
      );
    // if still selection is empty, then simply set it to all (*)
    if (allSelects.length === 0) allSelects.push({ selection: '*' });
    allSelects.push({
      selection: 'ROW_NUMBER() OVER(ORDER BY (SELECT NULL))',
      aliasName: 'rn',
      virtual: true,
    });
    // Use certain index
    // create a selection query
    const froms = this.expressionMap.aliases
      .filter(
        (alias) => alias.type === 'from' && (alias.tablePath || alias.subQuery),
      )
      .map((alias) => {
        if (alias.subQuery)
          return alias.subQuery + ' ' + this.escape(alias.name);
        return (
          this.getTableName(alias.tablePath) + ' ' + this.escape(alias.name)
        );
      });
    const select = this.createSelectDistinctExpression();
    const selection = allSelects
      .map(
        (select) =>
          select.selection +
          (select.aliasName ? ' AS ' + this.escape(select.aliasName) : ''),
      )
      .join(', ');
    return (
      select +
      selection +
      ' FROM ' +
      froms.join(', ') +
      this.createTableLockExpressionImport()
    );
  }

  /**
   * Creates "LIMIT" and "OFFSET" parts of SQL query.
   */
  createLimitOffsetExpression() {
    // in the case if nothing is joined in the query builder we don't need to make two requests to get paginated results
    // we can use regular limit / offset, that's why we add offset and limit construction here based on skip and take values
    let offset = this.expressionMap.offset,
      limit = this.expressionMap.limit;
    if (!offset && !limit && this.expressionMap.joinAttributes.length === 0) {
      offset = this.expressionMap.skip;
      limit = this.expressionMap.take;
    }

    let prefix = '';
    if (
      (limit || offset) &&
      Object.keys(this.expressionMap.allOrderBys).length <= 0
    ) {
      prefix = ' WHERE rn BETWEEN';
    }
    if (limit && offset)
      return prefix + ' ' + (offset + 1) + ' AND ' + (limit + offset);
    if (limit) return prefix + ' 1 ' + 'AND ' + limit;
    if (offset) {
      prefix = ' WHERE rn >= ';
      return prefix + (offset + 1);
    }

    return '';
  }

  private createTableLockExpressionImport() {
    if (this.connection.driver.options.type === 'mssql') {
      switch (this.expressionMap.lockMode) {
        case 'pessimistic_read':
          return ' WITH (HOLDLOCK, ROWLOCK)';
        case 'pessimistic_write':
          return ' WITH (UPDLOCK, ROWLOCK)';
        case 'dirty_read':
          return ' WITH (NOLOCK)';
      }
    }
    return '';
  }
}
