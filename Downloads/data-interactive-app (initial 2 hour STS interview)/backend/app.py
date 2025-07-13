from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Path to data.csv
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "data.csv")

# Ensure the data file exists or raise an error
if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"data.csv not found at: {DATA_PATH}")

# Helper function to load data
def load_data():
    try:
        return pd.read_csv(DATA_PATH)
    except Exception as e:
        print(f"Error loading data.csv: {e}")
        raise FileNotFoundError(f"Unable to load the file: {DATA_PATH}")


# Routes
@app.route('/data', methods=['GET'])
def get_data():
    """Fetch all data from data.csv"""
    df = load_data()
    return jsonify(df.to_dict(orient='records'))


@app.route('/data', methods=['POST'])
def add_row():
    """Add a new row to the data"""
    new_row = request.json
    df = load_data()
    df = df.append(new_row, ignore_index=True)
    df.to_csv(DATA_PATH, index=False)
    return jsonify({"message": "Row added successfully"})

@app.route('/data/<int:index>', methods=['DELETE'])
def delete_row(index):
    """Delete a row by its index"""
    df = load_data()
    if index < 0 or index >= len(df):
        return jsonify({"error": "Invalid index"}), 400
    df = df.drop(index=index).reset_index(drop=True)
    df.to_csv(DATA_PATH, index=False)
    return jsonify({"message": "Row deleted successfully"})

@app.route('/data', methods=['PUT'])
def edit_row():
    """Edit a row by its index"""
    data = request.json
    index = data.get('index')
    new_row = data.get('row')
    df = load_data()
    if index < 0 or index >= len(df):
        return jsonify({"error": "Invalid index"}), 400
    df.iloc[index] = new_row
    df.to_csv(DATA_PATH, index=False)
    return jsonify({"message": "Row updated successfully"})



if __name__ == '__main__':
    app.run(debug=True)
