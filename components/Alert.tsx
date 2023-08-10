import React from 'react'
import {
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter
} from "@chakra-ui/react"


export interface AlertMessage {
    header: string,
    body: string
}
function Alert(alertMessage: AlertMessage, onClose: () => void){
    return (
        <AlertDialog
            isOpen={alertMessage.header != "" && alertMessage.body != ""}
            onClose={onClose}
            >   
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        { alertMessage.header }
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        { alertMessage.body }
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button onClick={onClose}>
                        Close
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default Alert