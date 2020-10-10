<?php

namespace App\Http\Controllers\API;

use DB;
use Illuminate\Http\Request;
use App\Services\ContactService;
use App\Http\Controllers\Controller;

class ContactController extends Controller
{
    public function __construct(ContactService $contactService)
    {
        parent::__construct();

        $this->contactService = $contactService;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        
        try {

            $contacts = $this->contactService->storeTemplate($request);

            $this->data['results']['message'] = "Contacts Succesfully saved.";
            $this->data['results']['contacts'] = $contacts;
            $this->data['status'] = 200;

        } catch (\Exception $e) {

            $this->data['error'] = $e->getMessage();
            DB::rollBack();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);

    }

}
