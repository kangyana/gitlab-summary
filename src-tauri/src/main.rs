#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use serde_json::value::Value;
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

#[derive(Debug)]
struct Database(Arc<Mutex<HashMap<String, String>>>);

#[derive(Serialize)]
struct TokenBody<'a> {
    grant_type: &'a str,
    username: &'a str,
    password: &'a str,
}

#[derive(Serialize, Deserialize)]
struct TokenResponse {
    access_token: String,
    token_type: String,
    refresh_token: String,
    scope: String,
    created_at: u32,
}

fn main() {
    tauri::Builder::default()
        .manage(Database(Default::default()))
        .invoke_handler(tauri::generate_handler![
            db_insert,
            db_read,
            db_read_all,
            oauth_token,
            user,
            projects,
            project_commits,
        ])
        .run(tauri::generate_context!())
        .expect("运行tauri应用程序时出错");
}

#[tauri::command]
async fn oauth_token(
    username: String,
    password: String,
    database: tauri::State<'_, Database>,
) -> Result<TokenResponse, String> {
    let res = get_oauth_token(username.clone(), password.clone()).await;
    db_insert("username".into(), username.clone(), database.clone());

    match res {
        Ok(r) => {
            let access_token = r.access_token.clone();
            db_insert(
                "access_token".into(),
                access_token.clone(),
                database.clone(),
            );
            Ok(r)
        }
        Err(e) => {
            println!("error: {:#?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
async fn user(database: tauri::State<'_, Database>) -> Result<HashMap<String, Value>, String> {
    let res = get_user(database.clone()).await;

    match res {
        Ok(r) => Ok(r),
        Err(e) => {
            println!("error: {:#?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
async fn projects(
    database: tauri::State<'_, Database>,
) -> Result<Vec<HashMap<String, Value>>, String> {
    let res = get_projects(database.clone()).await;

    match res {
        Ok(r) => Ok(r),
        Err(e) => {
            println!("error: {:#?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
async fn project_commits(
    project_id: u16,
    database: tauri::State<'_, Database>,
) -> Result<Vec<HashMap<String, Value>>, String> {
    let res = get_project_commits(project_id, database.clone()).await;

    match res {
        Ok(r) => {
            println!("res: {:#?}", r);
            Ok(r)
        }
        Err(e) => {
            println!("error: {:#?}", e);
            Err(e.to_string())
        }
    }
}

async fn get_oauth_token(
    username: String,
    password: String,
) -> Result<TokenResponse, reqwest::Error> {
    let client = reqwest::Client::new();
    let body = TokenBody {
        grant_type: "password",
        username: &username,
        password: &password,
    };
    let res = client
        .post("https://gitlab.ydjdev.com/oauth/token")
        .json(&body)
        .send()
        .await?
        .json::<TokenResponse>()
        .await?;
    Ok(res)
}

async fn get_user(
    database: tauri::State<'_, Database>,
) -> Result<HashMap<String, Value>, reqwest::Error> {
    let access_token = db_read("access_token".into(), database.clone()).unwrap();
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

async fn get_projects(
    database: tauri::State<'_, Database>,
) -> Result<Vec<HashMap<String, Value>>, reqwest::Error> {
    let access_token = db_read("access_token".into(), database.clone()).unwrap();
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

async fn get_project_commits(
    project_id: u16,
    database: tauri::State<'_, Database>,
) -> Result<Vec<HashMap<String, Value>>, reqwest::Error> {
    let access_token = db_read("access_token".into(), database.clone()).unwrap();
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

#[tauri::command]
fn db_insert(key: String, value: String, db: tauri::State<'_, Database>) {
    db.0.lock().unwrap().insert(key, value);
}

#[tauri::command]
fn db_read(key: String, db: tauri::State<'_, Database>) -> Option<String> {
    db.0.lock().unwrap().get(&key).cloned()
}

#[tauri::command]
fn db_read_all(db: tauri::State<'_, Database>) -> HashMap<String, String> {
    db.0.lock().unwrap().clone()
}
