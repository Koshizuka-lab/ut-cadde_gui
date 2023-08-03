import React from 'react'
import { useState } from "react";
import { useContext } from "react";
import { AuthToken } from "../pages/_app";
import { Input, Button, FormControl, Flex, Spacer, AlertDialog, useDisclosure, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react"

interface DownloadProps {
    caddec_dataset_id_for_detail: string,
    provider_id: string,
    resource_name: string
}

function Download(props: DownloadProps) {
    const { token, setToken } = useContext(AuthToken)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    
    const downloadFile = ((blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })

    const Alert = ((message: string) => {
        return (
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                >   
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogBody>
                        { message }
                        </AlertDialogBody>

                        <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            閉じる
                        </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialogOverlay>
            </AlertDialog>
        )
    })

    const doAction = (e) => {
        e.preventDefault()
        fetch("/api/detailcatalog?q=" + props.caddec_dataset_id_for_detail, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "provider_id": props.provider_id,
                "token": token
            },
        })
        .then((res) => res.json())
        .then((json) => {
            console.log(json)
            var resource_url = ""
            for (var i = 0; i < json["result"]["results"][0]["resources"].length; i++) {
                if (json["result"]["results"][0]["resources"][i]["name"] == props.resource_name) {
                    resource_url = json["result"]["results"][0]["resources"][i]["url"]
                    break
                }
            }
            let resource_api_type = "file/http"
            console.log("get data")
            return fetch("/api/providers_immediate", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "provider_id": props.provider_id,
                    "token": token,
                    "resource_url": resource_url,
                    "resource_api_type": resource_api_type
                    }
            }).then((res) => {
                return res.blob()
            })
            .then(
                blob => {
                    downloadFile(blob, props.resource_name)
                }
            ).catch((error) => {
                console.log(error)
                onOpen()
            })
        }).catch((error) => {
            console.log(error)
            onOpen()
        })
    }

    return (
        <div>
            <Button 
                onClick={doAction}
                colorScheme="teal"
                variant="outline"
                size="sm"
                >
                ダウンロード
            </Button>
            { Alert("ダウンロードに失敗しました")}
        </div>
    )
}

export default Download