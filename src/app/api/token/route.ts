/**
 * Token API route — generates a LiveKit access token for the user
 * AND dispatches the Pi AI agent to join the same room.
 * 
 * Without the agent dispatch, the user would connect to an empty room
 * because our agent uses explicit dispatch (agent_name="UnlockPi").
 */

import { AccessToken, AgentDispatchClient } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const room = req.nextUrl.searchParams.get("room");
    const username = req.nextUrl.searchParams.get("username");
    if (!room) {
        return NextResponse.json(
            { error: 'Missing "room" query parameter' },
            { status: 400 }
        );
    } else if (!username) {
        return NextResponse.json(
            { error: 'Missing "username" query parameter' },
            { status: 400 }
        );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
        return NextResponse.json(
            { error: "Server misconfigured" },
            { status: 500 }
        );
    }

    // 1. Generate the access token for the user
    const at = new AccessToken(apiKey, apiSecret, { identity: username });
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    // 2. Dispatch the AI agent to this room
    //    The agent server registers with agent_name="UnlockPi", so we must
    //    explicitly dispatch it. Without this, the agent never joins.
    //    The host URL must be HTTPS (not WSS) for the REST API.
    const httpUrl = wsUrl.replace("wss://", "https://").replace("ws://", "http://");
    try {
        const agentClient = new AgentDispatchClient(httpUrl, apiKey, apiSecret);
        await agentClient.createDispatch(room, "UnlockPi");
        console.log(`[Token API] Dispatched agent "UnlockPi" to room "${room}"`);
    } catch (err) {
        // Log but don't fail — the agent might already be in the room,
        // or auto-dispatch might be enabled on the LiveKit project
        console.warn(`[Token API] Agent dispatch warning:`, err);
    }

    return NextResponse.json({ accessToken: await at.toJwt() });
}
