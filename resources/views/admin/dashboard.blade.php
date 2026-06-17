@extends('layouts.app')

@section('content')

@php
    $reactProps = [
        'stats' => $stats,
        'doctors' => collect($doctors)->map(fn ($d) => [
            'id' => $d->id,
            'name' => $d->name,
            'department' => $d->department->name ?? '',
        ])->values(),
        'searchUrl' => route('appointments.search'),
    ];
@endphp

<div data-react="dashboard" data-props="{{ json_encode($reactProps) }}"></div>

@endsection
