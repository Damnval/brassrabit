<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Contact;

class ContactTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testExample()
    {
        $this->assertTrue(true);
    }

    /**
     * Creating Contact
     *
     * @return void
     */
    public function testUserCreation()
    {
        $user = new Contact([
            'email' => "test@mail.com",
            'subject' => "Test Subject",
            'message' => "Test message"
        ]);   
        
        $this->assertTrue(true);
    }   

}
