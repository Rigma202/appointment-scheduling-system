@extends('layouts.app')

@section('content')

@php
    $reactProps = [
        'doctors' => collect($doctors)->map(fn ($d) => [
            'id' => $d->id,
            'name' => $d->name,
            'department' => $d->department->name ?? '',
        ])->values(),
    ];
@endphp

<div data-react="availability" data-props="{{ json_encode($reactProps) }}"></div>

@endsection
