<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Appoinment Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.8/css/dataTables.bootstrap5.min.css">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">

    @stack('styles')
</head>

<body>

    <div class="d-flex">

        <!-- Sidebar -->
        <div class="bg-dark text-white p-3" style="width:250px; min-height:100vh;">

            @if(auth()->user()->role === 'admin')
            <h4 class="mb-4" style="color:#C19A6B;">Admin Panel</h4>

            <ul class="nav flex-column">

                <li class="nav-item mb-2">
                    <a href="{{ route('dashboard') }}" class="nav-link text-white">
                        Dashboard
                    </a>
                </li>
                <li class="nav-item mb-2">
                    <a href="{{ route('doctors.index') }}" class="nav-link text-white">
                        Manage Doctor
                    </a>
                </li>
                <li class="nav-item mb-2">
                    <a href="{{ route('patients.index') }}" class="nav-link text-white">
                        Manage Patient
                    </a>
                </li>
                    <li class="nav-item mb-2">
                        <a href="{{ route('appointments.index') }}" class="nav-link text-white">
                        Appointments
                        </a>
                    </li>
                    <li class="nav-item mb-2">
                        <a href="{{ route('appointments.availability') }}" class="nav-link text-white">
                            Check Availability
                        </a>
                    </li>

                @endif

                @if(auth()->user()->role === 'staff')
                <h3 class="mb-4" style="color:#C19A6B;">Staff Panel</h3>

                <ul class="nav flex-column">

                    <li class="nav-item mb-2">
                        <a href="{{ route('staff.dashboard') }}" class="nav-link text-white">
                            Dashboard
                        </a>
                    </li>

                    @endif

                </ul>
        </div>

        <div class="w-100">
            <nav class="navbar navbar-light bg-light px-4 d-flex justify-content-end">

                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown">
                        {{ Auth::user()->name }}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <a class="dropdown-item"
                                href="{{ route('profile.edit') }}">
                                Profile
                            </a>
                        </li>

                        <li>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="dropdown-item">
                                    Logout
                                </button>
                            </form>

                        </li>

                    </ul>

                </div>

            </nav>

            <!-- Page Content -->
            <div class="p-4">

                @yield('content')

            </div>

        </div>

    </div>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.8/js/dataTables.bootstrap5.min.js"></script>
    @stack('scripts')

</body>

</html>
