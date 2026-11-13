The Database panel lets you look inside a database and run SQL without leaving the editor. You add a connection, browse its tables, run queries in a workbench, and see how the tables relate in a graph. It works with SQLite, PostgreSQL, MySQL and MariaDB, SQL Server and Oracle.

This tutorial takes about ten minutes. You build a tiny SQLite database from scratch, so you need no server, then see how to connect to a real one.

## 1. Open the panel

Press `Ctrl+K` then `D`, or click the **Databases** icon in the status bar. The panel opens along the bottom of the window.

At the top is a row of tabs, one for each kind of database: **SQLite**, **PostgreSQL**, **MySQL / MariaDB**, **MSSQL** and **Oracle**. Under it is a row for that kind's connections, which ends with an **Add Connection** tab.

[//]: # (TODO screenshot database-panel-1-overview.png: The Database panel at the bottom with the type tabs and the Add Connection tab.)

## 2. Make a practice database

SQLite keeps a whole database in one file, so it is the easiest place to start. An empty file is a valid, empty SQLite database. In the project folder, create one:

```sh
touch practice.db
```

On Windows, `type nul > practice.db` does the same. If you already have a SQLite file (`.db`, `.sqlite`), you can use that instead.

## 3. Add the connection

1. Click the **SQLite** tab, then the **Add Connection** tab.
2. Click **Choose file…** and pick `practice.db`. The **Title** fills in with the file name; change it if you like.
3. Click **Connect**.

The connection appears as a tab with a green **●** beside it, and a header above shows its name, its type and **Connected**. The marks beside a connection mean:

| Mark | Meaning |
| --- | --- |
| ● | Connected |
| ○ | Not connected |
| ◐ | Connecting |
| ! | An error, with the reason shown under the header |

[//]: # (TODO screenshot database-panel-2-connected.png: The SQLite connection tab with the connected header and the Workbench, Schema Graph, Refresh and Disconnect buttons.)

## 4. Run your first statements

Click **Workbench** in the header. A SQL workbench opens as a tab in the main editor area. It has a schema tree on the left, and an editor with a **Run** button and a results table on the right.

Run the statements below one at a time: replace what is in the editor with the statement, then click **Run**.

```sql
CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
```

```sql
CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER REFERENCES authors(id));
```

```sql
INSERT INTO authors (name) VALUES ('Ursula K. Le Guin'), ('Octavia E. Butler');
```

```sql
INSERT INTO books (title, author_id) VALUES ('A Wizard of Earthsea', 1), ('Kindred', 2);
```

```sql
SELECT books.title, authors.name FROM books JOIN authors ON authors.id = books.author_id;
```

You should see a results table with two rows, one for each book and its author. While a statement runs the button says **Running…**, and a statement that fails shows **Query failed** with the reason.

A few things to try in the workbench:

- Start typing a table or column name. **Autocomplete** suggests names from the schema.
- Right-click a table in the tree on the left to insert a ready-made statement.
- Every statement you run is kept in **History**. Click one to bring it back.
- Use **Copy JSON**, **Copy SQL**, **Export JSON** or **Export SQL** to take the results with you.

[//]: # (TODO screenshot database-panel-3-workbench.png: The workbench with the SELECT statement and its two result rows.)

## 5. Explore the schema

Go back to the Database panel. The tables you just made are already there: the schema is read again by itself after a statement that changes it, such as `CREATE`, `ALTER` or `DROP`. The body has three panes you can resize:

| Pane | What it shows |
| --- | --- |
| **Explorer** (left) | A tree of tables and views, which expands to columns and indexes. Type in **Filter tables or columns…** to narrow it |
| **Content** (centre) | Tabs for **Overview**, **Tables**, **Views** and **Relationships**. Click a table to see its columns, indexes and foreign keys |
| **Inspector** (right) | Details of whatever is selected, such as a table or one column |

Click `books`. You should see its three columns and the foreign key to `authors`.

## 6. See the tables as a graph

Click **Schema Graph** in the header. A new tab draws each table as a box and each foreign key as a line between them, laid out for you, on a canvas you can pan and zoom. For the practice database you see `books` joined to `authors`.

Workbench and Schema Graph tabs are remembered. Step 8 says what you see when you start Forge Super again.

[//]: # (TODO screenshot database-panel-4-graph.png: The Schema Graph tab with the authors and books tables joined.)

## 7. Connect to a database server

For PostgreSQL, MySQL / MariaDB, SQL Server or Oracle, open that type's tab, click **Add Connection**, and fill in the form:

| Field | What to enter |
| --- | --- |
| **Title** | A name for the connection |
| **Host** | The server's address |
| **Port** | Filled in with the usual one: 5432 for PostgreSQL, 3306 for MySQL / MariaDB, 1433 for SQL Server, 1521 for Oracle |
| **Service Name** | Oracle only: the service to connect to |
| **Username** and **Password** | Your login. The password goes into your system's credential store, not into the saved connection |
| **SSL** | Turn it on if the server requires an encrypted connection |

Click **Connect**. If it cannot, the reason is shown above the form so you can correct a field and try again.

Once connected, a strip of tabs under the header lists the databases you have open on that server. A workbench or graph tab belongs to one database: with several open on a server, **Run** runs on the database of the tab you are in, not on whichever you chose last.

- **Open existing ▾** lists the databases found on the server that you have not opened yet. Pick one to open it.
- **+ Create database** takes a name. **Create** makes a new database on the server, and **Add** opens one that already exists, for a name the list did not show. **Cancel** closes it.

An Oracle connection is a single service, so it has neither.

## 8. Pick up where you left off

Close Forge Super and start it again. Your workbench and graph tabs come back at once, and so does the list of databases each workspace had open.

- **Only one database per server connects at startup:** the one the connection was on last. The others stay in the strip, marked **not connected**.
- **A tab for a database that is not connected** says so, with a **Connect** button. It also connects by itself the first time you look at it, so having many tabs open does not mean many connections at startup. While it connects it says **Connecting to …**. If that fails it says **Could not connect to …**, gives the reason, and offers **Retry**.
- **Choosing a not-connected database in the strip** connects it too.
- **The list belongs to the workspace.** Two workspaces that use the same server each get back their own databases.
- **The x on a database tab** closes it and takes it off the list, connected or not. **Disconnect** (next step) keeps the databases listed.
- **A SQLite file or an Oracle service** is the whole connection, so it reconnects at startup.
- **A tab whose connection you have since deleted** cannot be restored, and a message says so.

## 9. Disconnect and tidy up

**Disconnect** closes the session but keeps the connection, so **Connect** brings it back. The databases you had open stay in the strip, marked **not connected**. The red bin button deletes the connection. You are asked first, and the question says what it does: it removes the saved connection and its stored schema, and does not change the database itself.

## If something goes wrong

**"Could not connect".** Read the reason that follows. The usual causes are a wrong host, port, username or password, a server that is not running, or an SSL setting that does not match the server.

**A tab says the database is not connected.** It was open last time and has not been connected yet. Click **Connect**, or choose it in the strip. If it says **Could not connect**, read the reason: usually the server is off or the database has been dropped.

**"Failed to load schema".** The connection worked but reading the tables did not. Click **Retry**.

**"Busy — waiting on another connection".** Another connection is still connecting or changing. The buttons are disabled until it finishes.

**The explorer does not show a change.** The schema refreshes by itself after a statement you run in the workbench. If the database was changed somewhere else, click **Refresh** in the connection header.

**"No tables".** The database is empty. Create a table in the workbench.
