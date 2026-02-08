
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { API_BASE } from './api';

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
    const socket = new SockJS(`${API_BASE}/ws`);
    stompClient = Stomp.over(socket);

    // Disable debug logs to keep console clean
    stompClient.debug = () => { };

    stompClient.connect({}, (frame) => {
        console.log('Connected to WebSocket: ' + frame);

        // Subscribe to public topic
        stompClient.subscribe('/topic/vehicles', (message) => {
            if (message.body) {
                const data = JSON.parse(message.body);
                onMessageReceived(data);
            }
        });
    }, (error) => {
        console.error('WebSocket connection error:', error);
    });
};

export const disconnectWebSocket = () => {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    console.log("Disconnected from WebSocket");
};
