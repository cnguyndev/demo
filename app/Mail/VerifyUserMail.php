<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyUserMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $verifyUrl;

    public function __construct(User $user, string $verifyUrl)
    {
        $this->user = $user;
        $this->verifyUrl = $verifyUrl;
    }

    public function build()
    {
        return $this->subject('Xác thực tài khoản của bạn')
            ->view('emails.register.verify')
            ->with([
                'user' => $this->user,
                'verifyUrl' => $this->verifyUrl,
            ]);
    }
}
