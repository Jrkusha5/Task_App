<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use App\Http\Resources\TodoResource;
use Illuminate\Support\Facades\Validator;

class TodoController extends Controller
{
    public function index()
    {
        $todos = Todo::all();
        return TodoResource::collection($todos);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'status' => 'in:pending,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $validator->messages(),
            ], 432);
        }

        $todo = Todo::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'pending',
        ]);

        return response()->json([
            'message' => 'Task Created Successfully',
            'data' => new TodoResource($todo),
        ], 200);
    }

    public function show(Todo $todo)
    {
        return new TodoResource($todo);
    }

    public function update(Todo $todo, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'status' => 'in:pending,completed',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $validator->messages(),
            ], 432);
        }
    
        $todo->update([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? $todo->status,  // Only update if a new status is provided
        ]);
    
        return response()->json([
            'message' => 'Task Updated Successfully',
            'data' => new TodoResource($todo),
        ], 200);
    }
    

    public function destroy(Todo $todo)
    {
        $todo->delete();
        return response()->json(['message' => 'Task Deleted Successfully'], 200);
    }
}
