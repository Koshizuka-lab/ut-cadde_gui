import React from 'react'
import { useContext, useState } from "react";
import { LoginUser } from "../pages/_app";
import { Button } from "@chakra-ui/react"
import { Catalog, UserContext } from '../types';
import Alert, { AlertMessage } from "../components/Alert";


interface DownloadProps {
    caddecDatasetIdForDetail: string,
    providerId: string,
    resourceName: string
}
function Download(props: DownloadProps) {
    const { user, setUser }: UserContext = useContext(LoginUser)
    const [alertMessage, setAlertMessage] = useState({header: "", body: ""} as AlertMessage)

    const onOpenDialog = (message: AlertMessage) => {
        setAlertMessage(message)
      }
    
    const onCloseDialog = () => {
        setAlertMessage({header: "", body: ""})
    }

    const fetchDetailcatalog = async (): Promise<string> => {
        console.log("fetch detailcatalog")

        let resourceUrl: string = ""
        return fetch("/api/detailcatalog?q=" + props.caddecDatasetIdForDetail, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "provider_id": props.providerId,
                "token": user.token
            },
        })
        .then((res: Response) => res.json())
        .then((json: Catalog) => {
            
            // response from detailcatalog must be only one
            if (json["result"]["results"].length != 1) {
                onOpenDialog({header: "Internal server error", body: "Please contact to the administrator"})
                throw new Error("fetch detail catalog failed")
            }
            
            
            let resources = json["result"]["results"][0]["resources"]
            for (let resouce of resources) {
                if (resouce["name"] == props.resourceName) {
                    resourceUrl = resouce["url"]
                    break
                }
            }
            return resourceUrl
        })
    }

    const fetchResource = async (resourceUrl: string): Promise<void> => {
        console.log("fetch resource")
        return fetch("/api/fetch_resource", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "provider_id": props.providerId,
                "token": user.token,
                "resource_url": resourceUrl,
                "resource_api_type": "file/http"
                }
        })
        .then((res: Response) => {
            if (!res.ok) {
                throw new Error("fetch resouce failed")
            } else {
                return res.blob()
            }       
        })
        .then((blob: Blob) => {
            downloadFile(blob, props.resourceName)
        })
        
    }

    const doAction = (e) => {
        e.preventDefault()
        fetchDetailcatalog()
        .catch((error) => {
            console.log(error)
            onOpenDialog({header: "Access denied", body: "Please contact to data provider."})
        })
        .then((resourceUrl: string) => {
            return fetchResource(resourceUrl)
        })
        .catch((error) => {
            console.log(error)
            onOpenDialog({header: "Download failed", body: "Please contact to data provider."})
        })
    }

    return (
        <div>
            <Button 
                onClick={doAction}
                colorScheme="teal"
                size="sm"
                >
                Download
            </Button>
            { Alert(alertMessage, onCloseDialog)}
        </div>
    )
}

function downloadFile(blob: Blob, filename: string) {
    const url: string = URL.createObjectURL(blob)
    const a: HTMLAnchorElement = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
}

export default Download