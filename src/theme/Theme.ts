import { IOrderPickerTheme } from "@djonnyx/tornado-types";

export const theme: IOrderPickerTheme = {
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
                        background: "rgba(0,0,0,0.83)",
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
                    buttonColor: "#30a02a",
                    buttonTextColor: "rgba(255,255,255,1)",
                }
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
            statusPicker: {
                backButton: {
                    iconColor: "#fff",
                }
            },
            orders: {
                background: "#fff",

                items: {
                    new: {
                        background: "#5d5d5d",
                        textColor: "#fff",
                        position: {
                            background: "#717171",
                            textColor: "#fff",
                            modifier: {
                                background: "#717171",
                                textColor: "#fff",
                            }
                        }
                    },
                    process: {
                        background: "#005d8d",
                        textColor: "#fff",
                        position: {
                            background: "#007ab9",
                            textColor: "#fff",
                            modifier: {
                                background: "#007ab9",
                                textColor: "#fff",
                            }
                        }
                    },
                    complete: {
                        background: "#3f7f00",
                        textColor: "#fff",
                        position: {
                            background: "#4c9900",
                            textColor: "#fff",
                            modifier: {
                                background: "#4c9900",
                                textColor: "#fff",
                            }
                        }
                    },
                    canceled: {
                        background: "#ce2424",
                        textColor: "#fff",
                        position: {
                            background: "#e42e2e",
                            textColor: "#fff",
                            modifier: {
                                background: "#e42e2e",
                                textColor: "#fff",
                            }
                        }
                    }
                }
            },
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
                    background: "rgba(255,255,255,0.25)",
                    window: {
                        background: "rgba(0,0,0,0.83)",
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
            statusPicker: {
                backButton: {
                    iconColor: "#fff",
                }
            },
            orders: {
                background: "#000",

                items: {
                    new: {
                        background: "#282828",
                        textColor: "#fff",
                        position: {
                            background: "#333333",
                            textColor: "#fff",
                            modifier: {
                                background: "#333333",
                                textColor: "#fff",
                            }
                        }
                    },
                    process: {
                        background: "#005d8d",
                        textColor: "#fff",
                        position: {
                            background: "#007ab9",
                            textColor: "#fff",
                            modifier: {
                                background: "#007ab9",
                                textColor: "#fff",
                            }
                        }
                    },
                    complete: {
                        background: "#3f7f00",
                        textColor: "#fff",
                        position: {
                            background: "#4c9900",
                            textColor: "#fff",
                            modifier: {
                                background: "#4c9900",
                                textColor: "#fff",
                            }
                        }
                    },
                    canceled: {
                        background: "#7a0b0b",
                        textColor: "#fff",
                        position: {
                            background: "#9e1010",
                            textColor: "#fff",
                            modifier: {
                                background: "#9e1010",
                                textColor: "#fff",
                            }
                        }
                    }
                }
            },
        }
    }
};
