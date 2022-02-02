//***** Validation rules for input fields */
import {I18nManager} from 'react-native';

const validation = {
  email: {
    presence: {
      message: I18nManager.isRTL
        ? 'رجاءا أدخل بريدك الإلكتروني'
        : 'Please enter your email',
    },
    format: {
      pattern: /^\w+([\.-]?\w+)+([\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
      message: I18nManager.isRTL
        ? 'يرجى إدخال البريد الإلكتروني الصحيح'
        : 'Please enter a valid email',
    },
  },
  check2: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء قبول المصطلح والحالة'
        : 'Please accept term and condition',
    },
  },
  forgotEmail: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال بريدك الإلكتروني لتلقي رمز التحقق'
        : 'Please enter your email to receive a verification code',
    },
    format: {
      pattern: /^\w+([\.-]?\w+)+([\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
      message: I18nManager.isRTL
        ? 'يرجى إدخال البريد الإلكتروني الصحيح'
        : 'Please enter a valid email',
    },
  },
  comment: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال تعليقك'
        : 'Please enter your comment',
    },
    length: {
      maximum: 500,
      message: I18nManager.isRTL
        ? 'آسف لأنك تجاوزت الحد 500'
        : 'Sorry You are Exceeding the Limit 500',
    },
  },
  password: {
    presence: {
      message: 'Please enter a password',
    },
    format: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,50}$/,
      message: I18nManager.isRTL
        ? 'يجب أن تحتوي كلمة المرور على 6 أحرف كحد أدنى و 50 حرفًا كحد أقصى ويجب أن تكون عبارة عن مزيج من الأحرف الكبيرة والصغيرة والحروف الخاصة والأرقام.'
        : 'Password should contain minimum 6 and maximum 50 character and it should be the combination of uppercase, lowercase, special character and numbers.',
    },
  },
  price: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال رسوم الإلغاء'
        : 'Please enter a cancellation charge',
    },
    format: {
      pattern: /^[1-9][0-9]?$|^100$/,
      // pattern: /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/,
      message: I18nManager.isRTL
        ? 'الرجاء إدخال المبلغ الصحيح'
        : 'Please enter correct amount',
    },
  },
  servicePrice: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال سعر الخدمة'
        : 'Please enter a service price',
    },
    format: {
      pattern: /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/,
      message: I18nManager.isRTL
        ? 'الرجاء إدخال المبلغ أكثر من الصفر'
        : 'Please enter amount more than zero',
    },
    length: {
      maximum: 6,
      message: I18nManager.isRTL
        ? 'رقم شحن الإلغاء بحد أقصى 6 أرقام'
        : 'cancellation charge digit maximum 6 digit',
    },
  },
  confirm_password: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال تأكيد كلمة المرور'
        : 'Please enter a confirm password',
    },
    format: {
      pattern: /^\S*$/,
      message: I18nManager.isRTL
        ? 'غير مسموح بالمسافات'
        : 'Spaces are not allowed',
    },
    match: {
      message: I18nManager.isRTL
        ? 'يجب أن تكون كلمة المرور الخاصة بك وتأكيد كلمة المرور متطابقة'
        : 'Your password & confirm password must be same',
    },
  },
  login_password: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال كلمة المرور'
        : 'Please enter a password',
    },
  },
  old_password: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال كلمة المرور القديمة الخاصة بك'
        : 'Please enter your old password',
    },
  },
  otp: {
    presence: {
      message: I18nManager.isRTL
        ? 'أدخل رمز التحقق الذي أرسلناه لك للتو على عنوان بريدك الإلكتروني'
        : 'Enter the verification code we just sent you on your email address',
    },
    format: {
      pattern: /^[0-9]{4,4}$/,
      message: I18nManager.isRTL
        ? 'الرجاء إدخال OTP صالح'
        : 'Please enter a valid OTP',
    },
    length: {
      minimum: 4,
      message: I18nManager.isRTL
        ? 'الرجاء إدخال OTP صالح'
        : 'Please enter a valid OTP',
    },
  },
  full_name: {
    presence: {
      message: I18nManager.isRTL
        ? 'من فضلك ادخل اسمك الكامل'
        : 'Please enter your full name',
    },
  },
  service_name: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال اسم الخدمة'
        : 'Please enter service name',
    },
  },
  phone: {
    presence: {
      message: I18nManager.isRTL
        ? 'من فضلك ادخل رقم الهاتف '
        : 'Please enter your Phone number',
    },
    // format: {
    //   pattern: /^[0-9]{10}$/,
    //   message:
    //     I18nManager.isRTL ? 'الرجاء إدخال رقم هاتف صالح ويجب أن يتكون من 10 أرقام.' : 'Please enter a valid phone number and it should be numeric with 10 digits.',
    // },
    length: {
      minimum: 7,
      maximum: 15,
      message: I18nManager.isRTL
        ? 'الرجاء إدخال رقم هاتف صالح ويجب أن يتكون من 7 إلى 15 رقمًا.'
        : 'Please enter a valid phone number and it should be numeric with 7 to 15 digits.',
    },
  },
  image: {
    presence: {
      message: I18nManager.isRTL
        ? 'يرجى تحميل صورة ملفك الشخصي'
        : 'Please upload your profile image',
    },
  },
  serviceType: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء تحديد نوع الخدمة'
        : 'Please select service type',
    },
  },
  cardType: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء تحديد البطاقة'
        : 'Please select card',
    },
  },
  messenger: {
    presence: {
      message: I18nManager.isRTL
        ? 'يرجى تحميل صورة ملفك الشخصي'
        : 'Please select messenger',
    },
  },
  messenger_id: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال معرف الرسول'
        : 'Please enter messenger id',
    },
  },
  country: {
    presence: {
      message: I18nManager.isRTL
        ? 'يرجى تحميل صورة ملفك الشخصي'
        : 'Please select Country',
    },
  },
  surname: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال الاسم الأخير'
        : 'Please enter last name',
    },
    length: {
      maximum: 20,
      message: I18nManager.isRTL
        ? 'آسف لأنك تجاوزت الحد 20'
        : 'Sorry You are Exceeding the Limit 20',
    },
  },
  salonName: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال الاسم الأخير'
        : 'Please enter Salon name',
    },
    length: {
      maximum: 20,
      message: I18nManager.isRTL
        ? 'آسف لأنك تجاوزت الحد 20'
        : 'Sorry You are Exceeding the Limit 20',
    },
  },
  serviceName: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال اسم الخدمة'
        : 'Please enter service name',
    },
    length: {
      maximum: 20,
      message: I18nManager.isRTL
        ? 'آسف لأنك تجاوزت الحد 20'
        : 'Sorry You are Exceeding the Limit 20',
    },
  },
  employee_name: {
    presence: {
      message: I18nManager.isRTL ? 'الرجاء إدخال الاسم' : 'Please enter name',
    },
    format: {
      pattern: /^(?!\s*$|\s).[a-z A-Z 0-9]{0,29}$/,
      message: I18nManager.isRTL
        ? 'الرجاء إدخال اسم صالح ويجب ألا يزيد عن 30 حرفًا.'
        : 'Please enter valid name and it should not be more than 30 characters.',
    },
  },
  name: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال الاسم الأول'
        : 'Please enter first name',
    },
    length: {
      maximum: 20,
      message: I18nManager.isRTL
        ? 'آسف لأنك تجاوزت الحد 20'
        : 'Sorry You are Exceeding the Limit 20',
    },
  },
  landmark: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال المعلم'
        : 'Please enter landmark',
    },
    length: {
      minimum: 3,
      maximum: 20,
      message: I18nManager.isRTL
        ? 'يجب أن يكون معلمك بين 3 و 20 حرفًا'
        : 'Your landmark must be between 3 and 20 characters',
    },
  },
  description: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال الاسم الأول'
        : 'Please enter Description',
    },
    length: {
      maximum: 5000,
      message: I18nManager.isRTL
        ? 'آسف لأنك تجاوزت الحد 5000'
        : 'Sorry You are Exceeding the Limit 5000',
    },
  },
  supportMessage: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال الرسائل'
        : 'Please enter Message',
    },
    length: {
      maximum: 5000,
      message: I18nManager.isRTL
        ? 'آسف لأنك تجاوزت الحد 5000'
        : 'Sorry You are Exceeding the Limit 5000',
    },
  },
  card_number: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال رقم البطاقة'
        : 'Please enter card number',
    },
    // format: {
    //   pattern: /^[0-9]{12,19}$/,
    //   message: I18nManager.isRTL ? 'الرجاء إدخال رقم بطاقة سارية المفعول' : "Please enter a valid card number"
    // },
    length: {
      minimum: 19,
      maximum: 19,
      message: I18nManager.isRTL
        ? 'آسف لأنك تجاوزت الحد يجب أن يكون حد البطاقة 16 رقمًا'
        : 'Card limit must be 16 digit',
    },
  },
  card_name: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال الاسم على البطاقة'
        : 'Please enter name on card',
    },
    format: {
      pattern: /^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 -]{2,54})?$/,
      message: I18nManager.isRTL
        ? 'الرجاء إدخال اسم صالح على البطاقة ويجب ألا يتراوح بين 3 أحرف بحد أقصى إلى 55 حرفًا'
        : 'Please enter valid name on card and it should not be between min 3 to max 55 characters.',
    },
  },
  card_cvv: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال السيرة الذاتية'
        : 'Please enter cvv',
    },
    // format: {
    //   pattern: /^[0-9]{3}$/,
    //   message: I18nManager.isRTL ? "الرجاء إدخال سيرة ذاتية صالحة" : "Please enter a valid cvv"
    // },
    length: {
      minimum: 3,
      maximum: 3,
      message: I18nManager.isRTL
        ? 'يجب أن تتكون سيرتك الذاتية من 3 أرقام على الأقل'
        : 'Your cvv must be at least 3 digits',
    },
  },
  card_month: {
    presence: {
      message: I18nManager.isRTL ? 'الرجاء إدخال الشهر' : 'Please enter month',
    },
    format: {
      pattern: /^[0-9]*$/,
      message: I18nManager.isRTL
        ? 'الرجاء إدخال شهر صالح'
        : 'Please enter a valid month',
    },
  },
  card_year: {
    presence: {
      message: I18nManager.isRTL ? 'الرجاء إدخال السنة' : 'Please enter year',
    },
    format: {
      pattern: /^[0-9]*$/,
      message: I18nManager.isRTL
        ? 'من فضلك ادخل سنة صحيحة'
        : 'Please enter a valid year',
    },
  },
  promocode: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء إدخال الرمز الترويجي'
        : 'Please enter promocode',
    },
  },
  location: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء تحديد الموقع'
        : 'Please select location',
    },
  },
  payment_method: {
    presence: {
      message: I18nManager.isRTL
        ? 'الرجاء تحديد طريقة الدفع'
        : 'Please select payment method',
    },
  },
};

export default validation;
