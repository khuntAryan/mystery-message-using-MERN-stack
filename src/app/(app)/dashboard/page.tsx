'use client'
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/userModel";
import { AcceptingMessageSchema } from "@/schemas/acceptingMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import { MessageCard } from "@/components/messageCards";
import { User } from "next-auth";
const dashBoard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isloading, setIsLoading] = useState(false)
    //state of the messages , accepting or not (messages)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { toast } = useToast()
    //here we are using optimistic UI 
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }
    const { data: session } = useSession()
    const form = useForm({
        resolver: zodResolver(AcceptingMessageSchema)
    })
    const { register, watch, setValue } = form
    const acceptMessages = watch('acceptMessages')

    //here we are getting the state
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get('/api/accept-message')
            setValue('acceptMessages', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<Response>
            toast({
                title: "Error",
                description: axiosError.message || 'failed to fetch messages'
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(true)
        try {
            const response = await axios.get('/api/get-message')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast({
                    title: "refreshed",
                    description: 'showing refreshed messages'
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<Response>
            toast({
                title: "Error",
                description: axiosError.message || 'failed to fetch messages'
            })
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) return
        fetchAcceptMessage()
        fetchMessages()
    }, [session, setValue, fetchMessages, fetchAcceptMessage])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post('/api/accept-message', {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message,
                variant: 'default'
            })
        } catch (error) {
            const axiosError = error as AxiosError<Response>
            toast({
                title: "Error",
                description: axiosError.message || 'failed to fetch messages'
            })
        }
    }

    //custom url 
    const { username } = session?.user as User
    const baseURL = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseURL}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "Copied",
            description: 'Link copied to Clipboard'
        })
    }

    if (!session || !session.user) {
        return <div>Please Login</div>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}
export default dashBoard