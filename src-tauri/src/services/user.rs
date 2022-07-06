use crate::constant::API_PATH;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Identities {
    provider: String,
    extern_uid: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UserResponse {
    id: u16,
    name: String,
    username: String,
    state: String,
    avatar_url: String,
    web_url: String,
    created_at: String,
    bio: String,
    bio_html: String,
    location: String,
    public_email: String,
    skype: String,
    linkedin: String,
    twitter: String,
    website_url: String,
    organization: String,
    job_title: String,
    bot: bool,
    work_information: String,
    followers: u16,
    following: u16,
    last_sign_in_at: String,
    confirmed_at: String,
    last_activity_on: String,
    email: String,
    theme_id: u16,
    color_scheme_id: u16,
    projects_limit: u32,
    current_sign_in_at: String,
    identities: Vec<Identities>,
    can_create_group: bool,
    can_create_project: bool,
    two_factor_enabled: bool,
    external: bool,
    private_profile: bool,
    commit_email: String,
}

pub async fn get_user(access_token: String) -> Result<UserResponse, reqwest::Error> {
    let request_url = format!("{}/user?access_token={}", API_PATH, access_token,);
    let res = reqwest::get(request_url)
        .await?
        .json::<UserResponse>()
        .await?;

    println!("res: {:#?}", res);
    Ok(res)
}
