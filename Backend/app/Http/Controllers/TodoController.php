<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\TodoResource;
use Illuminate\Support\Facades\Validator;

class TodoController extends Controller
{
    // Fetch all tasks
    public function index()
    {
        $todos = Todo::get();
         if($todos->count() > 0){
             return TodoResource::collection($todos);
         }
         else{
         return response()->json(['message' => 'No record available'],200);
         }
    }

    // Add a new task
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
        ]);

       if($validator->fails()){
          return response()->json([
            'message'=>'Title Input Required',
            'error'=>$validator->messages(),
          ],432);
       }

        $todo = Todo::create([
            'title' => $request->title,
            'description' => $request->description,
            
        ]);

        return response()->json(['message'=>'Tasks Created Successfully',
        'data'=>new TodoResource($todo)], 200);
    }
    //view all tasks

    public function show(Todo $todo){
        return new TodoResource($todo);

    }

    // Update an existing task
    public function update(Todo $todo ,Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
        ]);

       if($validator->fails()){
          return response()->json([
            'message'=>'Title Input Required',
            'error'=>$validator->messages(),
          ],432);
       }

        $todo ->update([
            'title' => $request->title,
            'description' => $request->description,
    
        ]);

        return response()->json(['message'=>'Tasks Updated Successfully',
        'data'=>new TodoResource($todo)], 200);
    }

    // Delete a task
    public function destroy(Todo $todo)
    {
       
        $todo->delete();

        return response()->json(['message'=>'Tasks Deleted Successfully',
        ], 200);
    }

}
