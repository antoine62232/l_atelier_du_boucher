import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast } from "@chakra-ui/react";
import { toaster } from "./toaster";

const Toaster = () => (
  <Portal>
    <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
      {(toast) => (
        <Toast.Root width={{ md: "sm" }}>
          {toast.type === "loading" ? <Spinner size="sm" color="brand.rouge" /> : <Toast.Indicator />}
          <Stack gap="1" flex="1" maxWidth="100%">
            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
            {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
          </Stack>
          {toast.closable && <Toast.CloseTrigger aria-label="Fermer" />}
        </Toast.Root>
      )}
    </ChakraToaster>
  </Portal>
);

export default Toaster;
