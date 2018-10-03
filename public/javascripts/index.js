$(function() {
    $('#radioBtn a').on('click', function() {
        var sel = $(this).data('title');
        var tog = $(this).data('toggle');
        
        $('#'+tog).prop('value', sel);
        
        $('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('active').addClass('notActive');
        $('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('active');
    })
});

$(function() {
    $('#confirm').on('focus', function() {
        $('#confirm_suggestion').show('slow');
    })

    $('#password').on('focus', function() {
        $('#password_suggestion').show('slow');
    })

    $('#confirm').on('blur', function() {
        $('#confirm_suggestion').hide('slow');
    })

    $('#password').on('blur', function() {
        $('#password_suggestion').hide('slow');
    })
});

$(document).ready(function() {
    $('#register-form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: 'The username is required and cannot be empty'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email is required and cannot be empty'
                    },
                    emailAddress: {
                        message: 'The email address is not valid'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required and cannot be empty'
                    },
                    regexp: {
                        regexp: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[$@!%?&]).{6,12}$/,
                        message: 'Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters'
                    }
                }
            },
            confirm: {
                validators: {
                    notEmpty: {
                        message: 'The confirm password is required and cannot be empty'
                    },
                    regexp: {
                        regexp: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[$@!%?&]).{6,12}$/,
                        message: 'Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters'
                    },
                    identical: {
                        field: 'password',
                        message: 'The password and its confirm are not the same'
                    }
                }
            }
        }
    });
    
    $('#login-form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: 'The username is required and cannot be empty'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The Password is required and cannot be empty'
                    }
                }
            }
        }
    });
    
    $('#forgot-form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email address is required'
                    },
                    emailAddress: {
                        message: 'The email address is not valid'
                    }
                }
            }
        }
    });
    
        $('#reset-form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required and cannot be empty'
                    },
                    identical: {
                        field: 'confirm',
                        message: 'The password and its confirm are not the same'
                    }
                }
            },
            confirm: {
                validators: {
                    notEmpty: {
                        message: 'The confirm password is required and cannot be empty'
                    },
                    identical: {
                        field: 'password',
                        message: 'The password and its confirm are not the same'
                    }
                }
            }
        }
    });
    
    $('#post-form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            title: {
                validators: {
                    notEmpty: {
                        message: 'The title is required'
                    }
                }
            },
            body: {
                validators: {
                    notEmpty: {
                        message: 'The body is required'
                    }
                }
            },
            author: {
                validators: {
                    notEmpty: {
                        message: 'The email address is required'
                    },
                    emailAddress: {
                        message: 'The email address is not valid'
                    }
                }
            }
        }
    });

    $('#comment-form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email is required'
                    },
                    emailAddress: {
                        message: 'The email address is not valid'
                    }
                }
            },
            message: {
                validators: {
                    notEmpty: {
                        message: 'The message is required'
                    }
                }
            }
        }
    });
});
