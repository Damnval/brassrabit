<?php

namespace App\Services;

use App\Models\Contact;
use App\Imports\ContactsImport;

class ContactService 
{

    /**
     * Saving new Template record in Contacts storage
     *
     * @param Object $request
     * @return Collections $contacts
     */
    public function storeTemplate($request)
    {
        $data = $request->input('csv');
        $contacts = $request->input('contacts');
        $contacts = json_decode($contacts, true);

        if (!$request->file('excel_file')) {
            return;
        }

        $request->validate([
            'excel_file' => 'required|mimes:xls,xlsx'
        ]);

        $file = $request->file('excel_file');
        // map the values from excel before saving
        \Excel::import(new ContactsImport($contacts), $file);
        
        return $this->getContacts();
    }

    /**
     * Get all records in contacts
     * 
     * @return Collection $contacts
     */
    public function getContacts()
    {
        $contacts = Contact::all();
        return $contacts;
    }

  
}
