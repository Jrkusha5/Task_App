import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'api_service.dart';

class TodoScreen extends StatefulWidget {
  @override
  _TodoScreenState createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  final ApiService apiService = ApiService();
  final TextEditingController titleController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  List<dynamic> todos = [];

  @override
  void initState() {
    super.initState();
    _fetchTodos();
  }

  void _fetchTodos() async {
    todos = await apiService.getTodos();
    setState(() {});
  }

  void _addOrUpdateTodo({String? id}) async {
    String title = titleController.text;
    String description = descriptionController.text;

    if (id == null) {
      await apiService.addTodo(title, description);
    } else {
      await apiService.updateTodo(id, title, description);
    }

    titleController.clear();
    descriptionController.clear();
    _fetchTodos();
  }

  void _deleteTodo(String id) async {
    await apiService.deleteTodo(id);
    _fetchTodos();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Todo List', style: GoogleFonts.poppins())),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(10),
            child: TextField(
              controller: titleController,
              decoration: InputDecoration(labelText: 'Title', border: OutlineInputBorder()),
            ),
          ),
          Padding(
            padding: EdgeInsets.all(10),
            child: TextField(
              controller: descriptionController,
              decoration: InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
            ),
          ),
          ElevatedButton(
            onPressed: () => _addOrUpdateTodo(),
            child: Text('Add Todo'),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: todos.length,
              itemBuilder: (context, index) {
                var todo = todos[index];
                return Card(
                  margin: EdgeInsets.symmetric(horizontal: 15, vertical: 5),
                  child: ListTile(
                    title: Text(todo['title'], style: GoogleFonts.poppins()),
                    subtitle: Text(todo['description'], style: GoogleFonts.poppins(fontSize: 14)),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: Icon(Icons.edit, color: Colors.blue),
                          onPressed: () {
                            titleController.text = todo['title'];
                            descriptionController.text = todo['description'];
                            _addOrUpdateTodo(id: todo['_id']);
                          },
                        ),
                        IconButton(
                          icon: Icon(Icons.delete, color: Colors.red),
                          onPressed: () => _deleteTodo(todo['_id']),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
