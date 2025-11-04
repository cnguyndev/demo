<?php

namespace App\Http\Controllers;

use App\Mail\ReplyContacy;
use App\Models\Contact;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contacts = Contact::query()
            ->with(["reply" => function ($query) {
                $query->select("id", "name", "email", "phone");
            }])
            ->get();;
        if (!$contacts) {
            return response()->json(null, 404);
        }
        return response()->json($contacts, 200);
    }

    public function getReply(string $id)
    {
        $contact = Contact::query()
            ->where('reply_id', $id)
            ->select("id", "user_id", "name", "email", "phone", "content", "status", "created_at")
            ->first();

        if (!$contact) {
            return response()->json(null, 404);
        }
        return response()->json($contact, 200);
    }

    public function updateStatusContact(Request $request, string $id)
    {
        $contact = Contact::find($id);
        if (!$contact) {
            return response()->json(null, 404);
        }
        $contact->status = $contact->status == 1 ? 0 : 1;
        $contact->save();
        return response()->json($contact, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $contact = new Contact();
        $contact->user_id = $request->user_id;
        $contact->name = $request->name;
        $contact->email = $request->email;
        $contact->phone = $request->phone;
        $contact->content = $request->content;
        $contact->status = 1;
        $contact->created_at = now();
        $contact->created_by = $request->created_by;

        $contact->save();
        return response()->json($contact, 200);
    }

    public function replyContact(Request $request)
    {
        $contact = new Contact();
        $contact->user_id = $request->user_id;
        $contact->name = $request->name;
        $contact->email = $request->email;
        $contact->phone = $request->phone;
        $contact->content = $request->content;
        $contact->reply_id = $request->reply_id;
        $contact->status = 1;
        $contact->created_at = now();
        $contact->created_by = $request->created_by;
        $contact->save();

        $origanalContact = Contact::find($contact->reply_id);
        $setting = Setting::find(1);

        Mail::to($contact->email)->send(new ReplyContacy($origanalContact, $request->content, $setting));
        return response()->json($contact, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $contact = Contact::find($id);
        if (!$contact) {
            return response()->json(null, 404);
        }
        return response()->json($contact, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $contact = Contact::find($id);
        if (!$contact) {
            return response()->json(null, 404);
        }
        $contact->user_id = $request->user_id;
        $contact->name = $request->name;
        $contact->email = $request->email;
        $contact->phone = $request->phone;
        $contact->content = $request->content;
        $contact->reply_id = $request->reply_id;
        $contact->status = $request->status;
        $contact->created_at = $request->created_at;
        $contact->updated_at = $request->updated_at;
        $contact->created_by = $request->created_by;
        $contact->updated_by = $request->updated_by;

        $contact->save();
        return response()->json($contact, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $contact = Contact::find($id);
        if (!$contact) {
            return response()->json(null, 404);
        }
        $contact->delete();
        return response()->json($contact, 200);
    }
}
