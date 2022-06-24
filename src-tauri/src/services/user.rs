use serde_json::value::Value;
use std::collections::HashMap;

pub async fn get_user(access_token: String) -> Result<HashMap<String, Value>, reqwest::Error> {
    let request_url = format!(
        "https://gitlab.ydjdev.com/api/v4/user?access_token={}",
        access_token,
    );
    let res = reqwest::get(request_url)
        .await?
        .json::<HashMap<String, Value>>()
        .await?;
    println!("res: {:#?}", res);
    Ok(res)
}