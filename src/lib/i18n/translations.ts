export const translations = {
  en: {
    // Navigation
    'nav.explore': 'Explore',
    'nav.contribute': 'Contribute',
    'nav.about': 'About',
    'nav.add_mosque': 'Add Mosque',
    'nav.admin': 'Admin',
    
    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.password_confirm': 'Confirm Password',
    'auth.name': 'Name (Optional)',
    'auth.login_with_google': 'Continue with Google',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.clear': 'Clear',
    'common.close': 'Close',
    'common.apply': 'Apply',
    'common.back': 'Back',
    
    // Mosque
    'mosque.name': 'Name',
    'mosque.address': 'Address',
    'mosque.state': 'State',
    'mosque.description': 'Description',
    'mosque.amenities': 'Amenities',
    'mosque.activities': 'Activities',
    'mosque.location': 'Location',
    'mosque.suggest_edit': 'Suggest Edit',
    'mosque.no_activities': 'No activities scheduled',
    
    // Explore
    'explore.title': 'Explore Mosques',
    'explore.subtitle': 'Find mosques with the facilities you need',
    'explore.search_placeholder': 'Search mosques...',
    'explore.no_results': 'No mosques found',
    'explore.clear_filters': 'Clear filters',
    'explore.showing': 'Showing',
    'explore.mosques': 'mosques',
    
    // Filters
    'filter.state': 'State',
    'filter.amenities': 'Amenities',
    'filter.distance': 'Distance',
    'filter.sort_by': 'Sort by',
    'filter.sort.nearest': 'Nearest',
    'filter.sort.most_amenities': 'Most Amenities',
    'filter.sort.alphabetical': 'Alphabetical',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.submissions': 'Submissions',
    'admin.mosques': 'Mosques',
    'admin.users': 'Users',
    'admin.audit_log': 'Audit Log',
    'admin.pending_submissions': 'Pending Submissions',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',
    'admin.rejection_reason': 'Rejection Reason',
    
    // Accessibility
    'accessibility.font_size': 'Font Size',
    'accessibility.increase': 'Increase',
    'accessibility.decrease': 'Decrease',
    'accessibility.reset': 'Reset',
  },
  bm: {
    // Navigation
    'nav.explore': 'Terokai',
    'nav.contribute': 'Sumbang',
    'nav.about': 'Tentang',
    'nav.add_mosque': 'Tambah Masjid',
    'nav.admin': 'Pentadbir',
    
    // Auth
    'auth.login': 'Log Masuk',
    'auth.logout': 'Log Keluar',
    'auth.register': 'Daftar',
    'auth.email': 'E-mel',
    'auth.password': 'Kata Laluan',
    'auth.password_confirm': 'Sahkan Kata Laluan',
    'auth.name': 'Nama (Pilihan)',
    'auth.login_with_google': 'Teruskan dengan Google',
    
    // Common
    'common.loading': 'Memuatkan...',
    'common.error': 'Ralat',
    'common.success': 'Berjaya',
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.delete': 'Padam',
    'common.edit': 'Edit',
    'common.submit': 'Hantar',
    'common.search': 'Cari',
    'common.filter': 'Tapis',
    'common.clear': 'Kosongkan',
    'common.close': 'Tutup',
    'common.apply': 'Guna',
    'common.back': 'Kembali',
    
    // Mosque
    'mosque.name': 'Nama',
    'mosque.address': 'Alamat',
    'mosque.state': 'Negeri',
    'mosque.description': 'Penerangan',
    'mosque.amenities': 'Kemudahan',
    'mosque.activities': 'Aktiviti',
    'mosque.location': 'Lokasi',
    'mosque.suggest_edit': 'Cadangkan Edit',
    'mosque.no_activities': 'Tiada aktiviti dijadualkan',
    
    // Explore
    'explore.title': 'Terokai Masjid',
    'explore.subtitle': 'Cari masjid dengan kemudahan yang anda perlukan',
    'explore.search_placeholder': 'Cari masjid...',
    'explore.no_results': 'Tiada masjid dijumpai',
    'explore.clear_filters': 'Kosongkan penapis',
    'explore.showing': 'Menunjukkan',
    'explore.mosques': 'masjid',
    
    // Filters
    'filter.state': 'Negeri',
    'filter.amenities': 'Kemudahan',
    'filter.distance': 'Jarak',
    'filter.sort_by': 'Susun mengikut',
    'filter.sort.nearest': 'Terdekat',
    'filter.sort.most_amenities': 'Kebanyakan Kemudahan',
    'filter.sort.alphabetical': 'Abjad',
    
    // Admin
    'admin.dashboard': 'Papan Pemuka',
    'admin.submissions': 'Penyerahan',
    'admin.mosques': 'Masjid',
    'admin.users': 'Pengguna',
    'admin.audit_log': 'Log Audit',
    'admin.pending_submissions': 'Penyerahan Menunggu',
    'admin.approve': 'Luluskan',
    'admin.reject': 'Tolak',
    'admin.rejection_reason': 'Sebab Penolakan',
    
    // Accessibility
    'accessibility.font_size': 'Saiz Fon',
    'accessibility.increase': 'Tambah',
    'accessibility.decrease': 'Kurang',
    'accessibility.reset': 'Set Semula',
  },
};

export type TranslationKey = keyof typeof translations.en;

