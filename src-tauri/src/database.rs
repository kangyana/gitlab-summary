use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

pub struct Database(pub Arc<Mutex<HashMap<String, String>>>);

pub fn db_insert(key: String, value: &String, db: &tauri::State<'_, Database>) {
    db.0.lock().unwrap().insert(key, value.clone());
}

pub fn db_read(key: String, db: &tauri::State<'_, Database>) -> String {
    db.0.lock().unwrap().get(&key).cloned().unwrap()
}

pub fn db_read_all(db: tauri::State<'_, Database>) -> HashMap<String, String> {
    db.0.lock().unwrap().clone()
}
