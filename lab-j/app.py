from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    return conn

with app.app_context():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            pages INTEGER NOT NULL,
            description TEXT
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
@app.route('/books')
def index():
    conn = get_db_connection()
    books = conn.execute('SELECT * FROM book').fetchall()
    conn.close()
    return render_template('index.html', books=books)

@app.route('/books/<int:id>')
def show(id):
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM book WHERE id = ?', (id,)).fetchone()
    conn.close()
    if book is None:
        return "Nie znaleziono książki", 404
    return render_template('show.html', book=book)

@app.route('/books/create', methods=('GET', 'POST'))
def create():
    if request.method == 'POST':
        title = request.form['title']
        pages = request.form['pages']
        description = request.form['description']

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO book (title, pages, description) VALUES (?, ?, ?)',
                         (title, pages, description))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return redirect(url_for('show', id=new_id))

    return render_template('create.html')

@app.route('/books/<int:id>/edit', methods=('GET', 'POST'))
def edit(id):
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM book WHERE id = ?', (id,)).fetchone()

    if request.method == 'POST':
        title = request.form['title']
        pages = request.form['pages']
        description = request.form['description']

        conn.execute('UPDATE book SET title = ?, pages = ?, description = ? WHERE id = ?',
                     (title, pages, description, id))
        conn.commit()
        conn.close()
        return redirect(url_for('show', id=id))

    conn.close()
    return render_template('edit.html', book=book)

@app.route('/books/<int:id>/delete', methods=('POST',))
def delete(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM book WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(port=57727, debug=True)