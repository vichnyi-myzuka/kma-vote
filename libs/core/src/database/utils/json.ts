export const getStringValueJsonQuery = (
  alias: string,
  fieldName: string,
  fieldValue: string,
): string => {
  return `("${alias}"."accessScenarioParams"::JSONB #> '{"student","${fieldName}"}' = '""'
  OR "${alias}"."accessScenarioParams"::JSONB #> '{"student","${fieldName}"}' = '"${fieldValue}"')`;
};

export const getArrayValueJsonQuery = (
  alias: string,
  fieldName: string,
  fieldValue: string,
): string => {
  return `(jsonb_array_length("${alias}"."accessScenarioParams"::JSONB #> '{"student","${fieldName}"}') = 0
  OR "${alias}"."accessScenarioParams"::JSONB #> '{"student","${fieldName}"}' = '["${fieldValue}"]')`;
};
