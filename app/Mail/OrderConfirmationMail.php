<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public Order $order;
    public $details; // collection OrderDetail

    public function __construct(Order $order, $details)
    {
        $this->order = $order;
        $this->details = $details;
    }

    public function build()
    {
        return $this->subject('Xác nhận thanh toán đơn hàng #' . $this->order->id)
            ->markdown('emails.order.confirmation', [
                'order'   => $this->order,
                'details' => $this->details,
            ]);
    }
}
