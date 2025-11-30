 export const fieldMap = {
    _id: "_id",
    
    // Basic info
    name: "basic_info.name",
    email: "basic_info.email",
    phone: "basic_info.phone",
    dob: "basic_info.dob",
    gender: "basic_info.gender",
  
    // Payment
    payment_status: "payment_detail.status",
    payment_method: "payment_detail.method",
    payment_last_paid_date: "payment_detail.last_paid_date",
    payment_invoices: "payment_detail.invoices",
  
    // Employment
    company: "employment.company",
    department: "employment.department",
    job_title: "employment.job_title",
    employee_id: "employment.employee_id",
    contract_type: "employment.contract.type",
    contract_start_date: "employment.contract.start_date",
    contract_end_date: "employment.contract.end_date",
    salary_base: "employment.contract.salary_breakup.base",
    salary_hra: "employment.contract.salary_breakup.hra",
    salary_bonus: "employment.contract.salary_breakup.bonus",
  
    // Travel
    travel_status: "travel_details.travel_status",
  
    // KYC
    kyc_verified: "kyc.verified",
    aadhaar_number: "kyc.documents.aadhaar.number",
    aadhaar_verified: "kyc.documents.aadhaar.verified",
    pan_number: "kyc.documents.pan.number",
    pan_verified: "kyc.documents.pan.verified",
    passport_number: "kyc.documents.passport.number",
    passport_expiry: "kyc.documents.passport.expiry",
    passport_verified: "kyc.documents.passport.verified",
  
    // Preferences
    language: "preferences.language",
    ui_theme_mode: "preferences.ui.theme.mode",
    font_size: "preferences.ui.theme.settings.font_size",
    color_blind_mode: "preferences.ui.theme.settings.color_blind_mode",
  
    // Notifications
    email_enabled: "notifications.email.enabled",
    email_marketing: "notifications.email.settings.marketing",
    email_transactional: "notifications.email.settings.transactional",
    email_alerts: "notifications.email.settings.alerts",
    sms_enabled: "notifications.sms.enabled",
    sms_otp: "notifications.sms.settings.otp",
    sms_alerts: "notifications.sms.settings.alerts",
  
    // Account
    account_status: "account_status",
    last_login: "last_login"
  };
  