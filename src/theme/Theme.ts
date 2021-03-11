import { IKioskTheme } from "@djonnyx/tornado-types";

export const theme: IKioskTheme = {
    name: "light",
    themes: {
        ["light"]: {
            common: {
                modal: {
                    background: "#e3e3e3",
                    window: {
                        background: "transparent",
                    }
                },
                modalTransparent: {
                    background: "rgba(0,0,0,0.5)",
                    window: {
                        background: "#fff",
                        borderColor: "rgba(0,0,0,0.1)"
                    }
                },
                modalNotification: {
                    background: "none",
                    window: {
                        background: "rgba(0,0,0,0.75)",
                        borderColor: "rgba(0,0,0,0.1)",
                    }
                },
                notificationAlert: {
                    textColor: "rgba(255,255,255,0.75)",
                },
                alert: {
                    titleColor: "rgba(0,0,0,0.75)",
                    messageColor: "rgba(0,0,0,0.75)",
                    buttonColor: "#ffa000",
                    buttonTextColor: "rgba(255,255,255,1)",
                }
            },
            languageModal: {
                item: {
                    borderColor: "rgba(0,0,0,0.15)",
                    textColor: "rgba(0,0,0,0.75)",
                }
            },
            languagePicker: {
                borderColor: "rgba(0,0,0,0.75)",
            },
            orderTypeModal: {
                item: {
                    borderColor: "rgba(0,0,0,0.15)",
                    textColor: "rgba(0,0,0,0.75)",
                }
            },
            orderTypePicker: {
                backgroundColor: "#212121",
                borderColor: "transparent",
                textColor: "rgba(255,255,255,1)",
            },
            service: {
                errorLabel: {
                    textColor: "red",
                },
                textInput: {
                    placeholderColor: "rgba(0,0,0,0.5)",
                    selectionColor: "#30a02a",
                    underlineColor: "#30a02a",
                    underlineWrongColor: "red",
                    textColor: "rgba(0,0,0,1)",
                },
                picker: {
                    textColor: "rgba(0,0,0,1)",
                    placeholderColor: "gray",
                },
                button: {
                    backgroundColor: "#30a02a",
                    textColor: "rgba(255,255,255,1)",
                }
            },
            loading: {
                background: "#fff",
                progressBar: {
                    thumbColor: "rgba(0,0,0,0.85)",
                    trackColor: "rgba(0,0,0,0.75)",
                    textColor: "rgba(0,0,0,0.75)",
                }
            },
            intro: {
                background: "#fff",
            },
            menu: {
                background: "#fff",
                header: {
                    background: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"],
                    titleColor: "rgba(0,0,0,0.75)",
                },
                orderPanel: {
                    backgroundColor: "rgba(0,0,0,0.025)",
                },
                backButton: {
                    iconColor: "rgba(0,0,0,0.75)",
                },
                sideMenu: {
                    item: {
                        backgroundColor: "#000",
                        nameColor: "rgba(0,0,0,0.75)",
                    },
                },
                navMenu: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(0,0,0,0.75)",
                        descriptionColor: "rgba(0,0,0,0.5)",
                        price: {
                            borderColor: "rgba(0,0,0,0.5)",
                            textColor: "rgba(0,0,0,0.5)",
                        }
                    }
                },
                orderType: {
                    borderColor: "rgba(0,0,0,0.75)",
                    textColor: "rgba(0,0,0,0.75)",
                },
                sum: {
                    description: {
                        textColor: "rgba(0,0,0,0.75)"
                    },
                    price: {
                        textColor: "rgba(0,0,0,0.75)"
                    },
                },
                draftOrder: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(0,0,0,0.75)",
                        price: {
                            borderColor: "rgba(0,0,0,0.5)",
                            textColor: "rgba(0,0,0,0.75)",
                        },
                        quantityStepper: {
                            buttons: {
                                backgroundColor: "#ffa000",
                                disabledBackgroundColor: "rgba(255,160,0,0.25)",
                                borderColor: "rgba(0,0,0,0.75)",
                                disabledBorderColor: "rgba(0,0,0,0.75)",
                                textColor: "rgba(255,255,255,1)",
                                disabledTextColor: "rgba(255,255,255,0.75)",
                            },
                            indicator: {
                                textColor: "rgba(0,0,0,0.75)",
                            }
                        }
                    }
                },
                ctrls: {
                    cancelButton: {
                        backgroundColor: ["#212121", "rgb(242, 62, 26)"],
                        disabledBackgroundColor: ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.1)"],
                    },
                    confirmButton: {
                        backgroundColor: ["#ffa000", "#30a02a"],
                        disabledBackgroundColor: ["rgba(255,160,0,0.25)", "rgba(0, 0, 0, 0.1)"],
                    }
                }
            },
            modifiers: {
                backgroundColor: "#fff",
                nameColor: "rgba(0,0,0,0.75)",
                descriptionColor: "rgba(0,0,0,0.75)",
                price: {
                    borderColor: "rgba(0,0,0,0.5)",
                    textColor: "rgba(0,0,0,0.75)",
                },
                group: {
                    nameColor: "rgba(0,0,0,0.75)",
                    descriptionColor: "rgba(0,0,0,0.75)",
                    descriptionInvalidColor: "#ff4e4e",
                    buttonPrevious: {
                        backgroundColor: "#212121",
                        disabledBackgroundColor: "transparent",
                        borderColor: "transparent",
                        disabledBorderColor: "rgba(0,0,0,0.1)",
                        textColor: "rgba(255,255,255,1)",
                        disabledTextColor: "rgba(0,0,0,0.1)",
                    },
                    buttonNext: {
                        backgroundColor: "#ffa000",
                        disabledBackgroundColor: "transparent",
                        borderColor: "transparent",
                        disabledBorderColor: "rgba(0,0,0,0.1)",
                        textColor: "rgba(255,255,255,1)",
                        disabledTextColor: "rgba(0,0,0,0.1)",
                    },
                    indicator: {
                        currentValidColor: "#ffa000",
                        currentInvalidColor: "#ff4e4e",
                        otherColor: "#212121",
                    }
                },
                item: {
                    backgroundColor: "transparent",
                    nameColor: "rgba(0,0,0,0.75)",
                    descriptionColor: "rgba(0,0,0,0.5)",
                    quantityStepper: {
                        buttons: {
                            backgroundColor: "transparent",
                            selectedBackgroundColor: "#ffa000",
                            disabledBackgroundColor: "transparent",
                            disabledSelectedBackgroundColor: "rgba(255,160,0,0.25)",
                            borderColor: "rgba(0,0,0,0.75)",
                            selectedBorderColor: "transparent",
                            disabledBorderColor: "rgba(0,0,0,0.75)",
                            disabledSelectedBorderColor: "transparent",
                            textColor: "rgba(0,0,0,0.75)",
                            selectedTextColor: "rgba(255,255,255,0.75)",
                            disabledTextColor: "rgba(0,0,0,0.75)",
                            disabledSelectedTextColor: "rgba(255,255,255,0.75)",
                        },
                        indicator: {
                            textColor: "rgba(0,0,0,0.75)",
                        }
                    }
                }
            },
            confirmation: {
                background: "#fff",
                backButton: {
                    backgroundColor: "#212121",
                    textColor: "#ffffff",
                },
                nextButton: {
                    backgroundColor: "#ffa000",
                    textColor: "#ffffff",
                },
                summaryPrice: {
                    textColor: "rgba(0,0,0,0.75)",
                },
                nestedItem: {
                    backgroundColor: "transparent",
                    nameColor: "#212121",
                    price: {
                        textColor: "rgba(0,0,0,0.75)",
                    },
                },
                item: {
                    backgroundColor: "transparent",
                    oddBackgroundColor: "rgba(0,0,0,0.025)",
                    nameColor: "rgba(0,0,0,0.75)",
                    price: {
                        textColor: "rgba(0,0,0,0.75)",
                    },
                    quantityStepper: {
                        buttons: {
                            backgroundColor: "#ffa000",
                            disabledBackgroundColor: "rgba(255,160,0,0.25)",
                            borderColor: "rgba(0,0,0,0.75)",
                            disabledBorderColor: "rgba(0,0,0,0.75)",
                            textColor: "rgba(255,255,255,1)",
                            disabledTextColor: "rgba(255,255,255,0.75)",
                        },
                        indicator: {
                            textColor: "rgba(0,0,0,0.75)",
                        }
                    }
                }
            },
            payStatus: {
                primaryMessageColor: "rgba(0,0,0,0.75)",
                secondaryMessageColor: "rgba(0,0,0,0.5)",
            },
            payConfirmation: {
                numberColor: "rgba(0,0,0,1)",
                primaryMessageColor: "rgba(0,0,0,0.75)",
                secondaryMessageColor: "rgba(0,0,0,0.5)",
            }
        },
        ["dark"]: {
            common: {
                modal: {
                    background: "#000",
                    window: {
                        background: "#000",
                    }
                },
                modalTransparent: {
                    background: "rgba(255,255,255,0.075)",
                    window: {
                        background: "#000",
                        borderColor: "rgba(255,255,255,0.1)"
                    }
                },
                modalNotification: {
                    background: "none",
                    window: {
                        background: "rgba(255,255,255,0.75)",
                        borderColor: "rgba(255,255,255,0.1)",
                    }
                },
                notificationAlert: {
                    textColor: "rgba(0,0,0,0.75)",
                },
                alert: {
                    titleColor: "rgba(255,255,255,0.75)",
                    messageColor: "rgba(255,255,255,0.75)",
                    buttonColor: "#30a02a",
                    buttonTextColor: "rgba(255,255,255,1)",
                }
            },
            languageModal: {
                item: {
                    borderColor: "transparent",
                    textColor: "rgba(255,255,255,0.75)",
                }
            },
            languagePicker: {
                borderColor: "rgba(255,255,255,0.15)",
            },
            orderTypeModal: {
                item: {
                    borderColor: "rgba(255,255,255,0.15)",
                    textColor: "rgba(255,255,255,0.75)",
                }
            },
            orderTypePicker: {
                backgroundColor: "#30a02a",
                borderColor: "rgba(255,255,255,0.25)",
                textColor: "rgba(255,255,255,1)",
            },
            service: {
                errorLabel: {
                    textColor: "red",
                },
                textInput: {
                    placeholderColor: "rgba(255,255,255,0.5)",
                    selectionColor: "#30a02a",
                    underlineColor: "#30a02a",
                    underlineWrongColor: "red",
                    textColor: "rgba(255,255,255,1)",
                },
                picker: {
                    textColor: "rgba(255,255,255,1)",
                    placeholderColor: "gray",
                },
                button: {
                    backgroundColor: "#30a02a",
                    textColor: "rgba(255,255,255,1)",
                }
            },
            loading: {
                background: "#000",
                progressBar: {
                    thumbColor: "rgba(255,255,255,0.85)",
                    trackColor: "rgba(255,255,255,0.75)",
                    textColor: "rgba(255,255,255,0.75)",
                }
            },
            intro: {
                background: "#000",
            },
            menu: {
                background: "#000",
                header: {
                    background: ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"],
                    titleColor: "rgba(255,255,255,0.75)",
                },
                orderPanel: {
                    backgroundColor: "rgba(255,255,255,0.025)",
                },
                backButton: {
                    iconColor: "rgba(255,255,255,0.75)",
                },
                sideMenu: {
                    item: {
                        backgroundColor: "#fff",
                        nameColor: "rgba(255,255,255,0.75)",
                    },
                },
                navMenu: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(255,255,255,0.75)",
                        descriptionColor: "rgba(255,255,255,0.5)",
                        price: {
                            borderColor: "rgba(255,255,255,0.5)",
                            textColor: "rgba(255,255,255,0.5)",
                        }
                    }
                },
                orderType: {
                    borderColor: "rgba(255,255,255,0.75)",
                    textColor: "rgba(255,255,255,0.75)",
                },
                sum: {
                    description: {
                        textColor: "rgba(255,255,255,0.75)"
                    },
                    price: {
                        textColor: "rgba(255,255,255,0.75)"
                    },
                },
                draftOrder: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(255,255,255,0.75)",
                        price: {
                            borderColor: "rgba(255,255,255,0.5)",
                            textColor: "rgba(255,255,255,0.75)",
                        },
                        quantityStepper: {
                            buttons: {
                                backgroundColor: "#30a02a",
                                disabledBackgroundColor: "#30a02a40",
                                borderColor: "rgba(0,0,0,0.75)",
                                disabledBorderColor: "rgba(0,0,0,0.75)",
                                textColor: "rgba(255,255,255,1)",
                                disabledTextColor: "rgba(255,255,255,0.75)",
                            },
                            indicator: {
                                textColor: "rgba(255,255,255,0.75)",
                            }
                        }
                    }
                },
                ctrls: {
                    cancelButton: {
                        backgroundColor: ["#212121", "rgb(242, 62, 26)"],
                        disabledBackgroundColor: ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.1)"],
                    },
                    confirmButton: {
                        backgroundColor: ["#30a02a", "#30a02a"],
                        disabledBackgroundColor: ["rgba(255,255,255, 0.075)", "rgba(255,255,255, 0.005)"],
                    }
                }
            },
            modifiers: {
                backgroundColor: "#000",
                nameColor: "rgba(255,255,255,0.75)",
                descriptionColor: "rgba(255,255,255,0.5)",
                price: {
                    borderColor: "rgba(255,255,255,0.5)",
                    textColor: "rgba(255,255,255,0.75)",
                },
                group: {
                    nameColor: "rgba(255,255,255,0.75)",
                    descriptionColor: "rgba(255,255,255,0.75)",
                    descriptionInvalidColor: "#ff4e4e",
                    buttonPrevious: {
                        backgroundColor: "#30a02a",
                        disabledBackgroundColor: "transparent",
                        borderColor: "transparent",
                        disabledBorderColor: "rgba(255,255,255,0.1)",
                        textColor: "rgba(255,255,255,1)",
                        disabledTextColor: "rgba(255,255,255,0.1)",
                    },
                    buttonNext: {
                        backgroundColor: "#30a02a",
                        disabledBackgroundColor: "transparent",
                        borderColor: "transparent",
                        disabledBorderColor: "rgba(255,255,255,0.1)",
                        textColor: "rgba(255,255,255,1)",
                        disabledTextColor: "rgba(255,255,255,0.1)",
                    },
                    indicator: {
                        currentValidColor: "#30a02a",
                        currentInvalidColor: "#ff4e4e",
                        otherColor: "rgba(255,255,255,0.25)",
                    }
                },
                item: {
                    backgroundColor: "transparent",
                    nameColor: "rgba(255,255,255,0.75)",
                    descriptionColor: "rgba(255,255,255,0.5)",
                    quantityStepper: {
                        buttons: {
                            backgroundColor: "transparent",
                            selectedBackgroundColor: "#30a02a",
                            disabledBackgroundColor: "transparent",
                            disabledSelectedBackgroundColor: "#30a02a40",
                            borderColor: "rgba(255,255,255,0.75)",
                            selectedBorderColor: "transparent",
                            disabledBorderColor: "rgba(255,255,255,0.75)",
                            disabledSelectedBorderColor: "transparent",
                            textColor: "rgba(255,255,255,0.75)",
                            selectedTextColor: "rgba(255,255,255,1)",
                            disabledTextColor: "rgba(255,255,255,0.75)",
                            disabledSelectedTextColor: "rgba(255,255,255,0.75)",
                        },
                        indicator: {
                            textColor: "rgba(255,255,255,0.75)",
                        }
                    }
                }
            },
            confirmation: {
                background: "#000",
                backButton: {
                    backgroundColor: "#212121",
                    textColor: "#ffffff",
                },
                nextButton: {
                    backgroundColor: "#30a02a",
                    textColor: "#ffffff",
                },
                summaryPrice: {
                    textColor: "#ffffff",
                },
                nestedItem: {
                    backgroundColor: "transparent",
                    nameColor: "rgba(255,255,255,0.5)",
                    price: {
                        textColor: "rgba(255,255,255,0.5)",
                    },
                },
                item: {
                    backgroundColor: "transparent",
                    oddBackgroundColor: "rgba(255,255,255,0.05)",
                    nameColor: "rgba(255,255,255,0.75)",
                    price: {
                        textColor: "rgba(255,255,255,0.75)",
                    },
                    quantityStepper: {
                        buttons: {
                            backgroundColor: "#30a02a",
                            disabledBackgroundColor: "#30a02a40",
                            borderColor: "rgba(255,255,255,0.75)",
                            disabledBorderColor: "rgba(255,255,255,0.75)",
                            textColor: "rgba(255,255,255,1)",
                            disabledTextColor: "rgba(255,255,255,0.75)",
                        },
                        indicator: {
                            textColor: "rgba(255,255,255,0.75)",
                        }
                    }
                }
            },
            payStatus: {
                primaryMessageColor: "rgba(255,255,255,0.75)",
                secondaryMessageColor: "rgba(255,255,255,0.5)",
            },
            payConfirmation: {
                numberColor: "rgba(255,255,255,1)",
                primaryMessageColor: "rgba(255,255,255,0.75)",
                secondaryMessageColor: "rgba(255,255,255,0.5)",
            }
        }
    }
};
