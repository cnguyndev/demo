<?php

namespace App\Mail;

use App\Models\Contact;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReplyContacy extends Mailable
{
    use Queueable, SerializesModels;

    public Contact $contact;
    public string $replyMessage;
    public Setting $setting;



    public function __construct(Contact $contact, string $replyMessage, Setting $setting)
    {
        $this->contact = $contact;
        $this->replyMessage = $replyMessage;
        $this->setting = $setting;
    }

    public function build()
    {
        return $this->subject('Phản hồi liên hệ của bạn!')
            ->markdown('emails.contact.reply', [
                'contact' => $this->contact,
                'replyMessage' => $this->replyMessage,
                'setting' => $this->setting,
            ]);
    }
}
