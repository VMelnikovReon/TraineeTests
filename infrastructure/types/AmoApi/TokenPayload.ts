export type TokenPayload = {
	aud: string,
	jti: string,
	iat: number,
	nbf: number,
	exp: number,
	sub: string,
	grant_type: string,
	account_id: string,
	base_domain: string,
	version: number,
	scopes: string[],
	hash_uuid: string
}