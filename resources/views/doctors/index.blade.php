@extends('layouts.app')

@section('content')

@php
    $reactProps = [
        'doctors' => collect($doctors)->map(fn ($d) => [
            'id' => $d->id,
            'name' => $d->name,
            'department' => $d->department->name ?? '',
            'phone' => $d->phone,
            'email' => $d->email,
            'department_id' => $d->department_id,
        ])->values(),
        'departments' => collect($departments)->map(fn ($d) => ['id' => $d->id, 'name' => $d->name])->values(),
        'storeAction' => route('doctors.store'),
        'baseUrl' => url('doctors'),
    ];
@endphp

<div data-react="doctors" data-props="{{ json_encode($reactProps) }}"></div>

@endsection
