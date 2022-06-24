use serde_json::value::Value;
use std::collections::HashMap;

pub async fn get_projects(
    access_token: String,
) -> Result<Vec<HashMap<String, Value>>, reqwest::Error> {
    let request_url = format!(
        "https://gitlab.ydjdev.com/api/v4/projects?access_token={}",
        access_token,
    );
    let res = reqwest::get(request_url)
        .await?
        .json::<Vec<HashMap<String, Value>>>()
        .await?;
    println!("res: {:#?}", res);
    Ok(res)
}

pub async fn get_project_commits(
    project_id: u16,
    access_token: String,
) -> Result<Vec<HashMap<String, Value>>, reqwest::Error> {
    let request_url = format!(
        "https://gitlab.ydjdev.com/api/v4/projects/{}/repository/commits?access_token={}",
        project_id, access_token,
    );
    println!("request_url: {}", request_url);
    let res = reqwest::get(request_url)
        .await?
        .json::<Vec<HashMap<String, Value>>>()
        .await?;
    println!("res: {:#?}", res);
    Ok(res)
}
