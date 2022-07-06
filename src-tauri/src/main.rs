#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use app::{
    database::{db_insert, db_read, Database},
    services::{
        oauth_token::{get_oauth_token, TokenResponse},
        projects::{get_project_commits, get_projects},
        user::{get_user, UserResponse},
    },
};
use serde_json::value::Value;
use std::collections::HashMap;

fn main() {
    tauri::Builder::default()
        .manage(Database(Default::default()))
        .invoke_handler(tauri::generate_handler![
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
    let res = get_oauth_token(&username, &password).await;
    db_insert(String::from("username"), &username, &database);

    match res {
        Ok(r) => {
            db_insert(String::from("access_token"), &r.access_token, &database);
            Ok(r)
        }
        Err(e) => {
            println!("error: {:#?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
async fn user(database: tauri::State<'_, Database>) -> Result<UserResponse, String> {
    let access_token = db_read(String::from("access_token"), &database);
    let res = get_user(access_token).await;

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
    let access_token = db_read(String::from("access_token"), &database);
    let res = get_projects(access_token).await;

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
    let access_token = db_read(String::from("access_token"), &database);
    let res = get_project_commits(project_id, access_token).await;

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
