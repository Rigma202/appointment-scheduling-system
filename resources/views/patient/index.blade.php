@extends('layouts.app')

@section('content')

@php
    $reactProps = [
        'patients' => collect($patients)->map(fn ($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'phone' => $p->phone,
            'email' => $p->email,
        ])->values(),
        'storeAction' => route('patients.store'),
        'baseUrl' => url('patients'),
    ];
@endphp

<div data-react="patients" data-props="{{ json_encode($reactProps) }}"></div>

@endsection
