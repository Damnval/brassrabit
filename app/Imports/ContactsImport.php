<?php

namespace App\Imports;

use App\Models\Contact;
use App\Mail\SendContactTemplates;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;


class ContactsImport implements ToModel, WithHeadingRow
{
    public $contacts;

    public $contact_count = 0;
    
    
   /**
    * Instantiate Injected variables
    *
    * @param array $contacts
    */
    public function __construct($contacts)
    {
        $this->contacts = $contacts;
    }


    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        $contact_max_count = count($this->contacts) - 1;
            foreach ($this->contacts as $key => $value) {
          
            $subject_pass = $this->checkMatchCount($value['subject'], $row);
            $email_pass = $this->checkMatchCount($value['message'], $row);

            // checks if variables are present in excel
            // will save if variables are missing in excel but last template
            if(($subject_pass && $email_pass) || ($key == $contact_max_count)){

                $subject_res = $this->interpolateVariables($row, $value['subject']);
                $message_res =  $this->interpolateVariables($row, $value['message']);

                $data = [
                    'email'  => $row['email'],
                    'subject' => $subject_res,
                    'message' => $message_res
                ];

                // saves in contacts table
                $contact = new Contact($data);
                //sends email using markdown
                Mail::send(new SendContactTemplates($contact));
                return $contact;
            }
                           
     
        }
    }

    /**
     * Replace variables to actual values getting from excel
     *
     * @param array $row
     * @param string $field_template
     * @return string 
     */
    public function interpolateVariables($row, $field_template)
    {
        return preg_replace_callback(
                                        '/{{ (\w+) }}/', 
                                        function($m) use($row) { 
                                            return $row[$m[1]]; 
                                        },
                                        $field_template
                                    );
    }

    /**
     * Check all variable interpolation if available in excel
     *
     * @param string $field_template
     * @param array $row
     * @return boolean 
     */
    public function checkMatchCount($field_template, $row)
    {
        preg_match_all('/{{ (.*?) }}/s', $field_template, $matches);

        $matches = $matches[1];
        foreach ($matches as $key => $value) {
            if(!$row[$value]){
               return false;
            }
        }

        return true;
    }

}