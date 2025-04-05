import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private'

export type TokenPackage = {
    accessToken: string
    expiresAt: Date
    refreshToken: string
}

export async function exchangeToken(code: string): Promise<TokenPackage> {
    const {
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: refreshToken
    } = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
        })
    }).then((res) => res.json())

    const expiresAt = new Date(Date.now() + expiresIn * 1000)

    return { accessToken, expiresAt, refreshToken }
}

export async function refreshToken(refreshToken: string): Promise<TokenPackage> {
    const {
        access_token: accessToken,
        expires_in: expiresIn,
        refresh_token: newRefreshToken
    } = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    }).then((res) => res.json())

    const expiresAt = new Date(Date.now() + expiresIn * 1000)

    return { accessToken, expiresAt, refreshToken: newRefreshToken }
}
