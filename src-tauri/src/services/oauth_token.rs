use crate::constant::API_BATH_PATH;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct TokenBody<'a> {
    grant_type: String,
    username: &'a str,
    password: &'a str,
}

#[derive(Serialize, Deserialize)]
pub struct TokenResponse {
    pub access_token: String,
    token_type: String,
    refresh_token: String,
    scope: String,
    created_at: u32,
}

pub async fn get_oauth_token(
    username: &String,
    password: &String,
) -> Result<TokenResponse, reqwest::Error> {
    let client = reqwest::Client::new();
    let body = TokenBody {
        grant_type: String::from("password"),
        username,
        password,
    };
    let request_url = format!("{}/oauth/token", API_BATH_PATH);
    let res = client
        .post(request_url)
        .json(&body)
        .send()
        .await?
        .json::<TokenResponse>()
        .await?;
    Ok(res)
}
