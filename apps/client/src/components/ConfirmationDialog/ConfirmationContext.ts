import { createContext, RefObject } from 'react';
import { ConfirmationDialogHandle } from '@app/client/components/ConfirmationDialog/ConfirmationDialog';

export type ConfirmationContextType = {
  confirmationDialogRef: RefObject<ConfirmationDialogHandle> | null;
};
export const ConfirmationContext = createContext<ConfirmationContextType>({
  confirmationDialogRef: null,
});
