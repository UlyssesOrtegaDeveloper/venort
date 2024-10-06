export const facturas = [
    {
        info: {
            email: 'test@test.com',
            user: 'Ulises'
        },

        datos: {
            factura_tipo: 'ordinaria',
            fecha_facturacion: '01/01/2024',
            fecha_vencimiento: '16/01/2024',
            numero_factura: '01/24'
        },

        estado: {
            total_factura: 0,
            estado_factura: 0 /// 0 = en reparto, 1 = factura enviada, 2 = factura cobrada
        },

        receptor: {
            razonSocial: 'Rhenus Logistics SAU',
            cif: 'B123456789',
            domicilio: 'calle el papapote, 2',
            codigoPostal: '35008 - Las Palmas de G.C',
            alias: 'Rhenus',
        },

        emisor: {
            email: 'emisor@empresa.com',
            telefono: '123456789',
            razon_social: 'Nombre Apellidos',
            dni: "123456789A",
            domicilio: '',
            cp: "35000 - Las Palmas de Gran Canaria",
            logo: 'logo.png'
        },
        
        impuestos: [
            {
                fechaRegistro: '2024/01/01',
                base: '',
                igic: 3,
                irpf: -1
            }
        ],

        concepto: {
            concepto: 'Transporte y reparto de mercancias'
        },

        precios: [
            {
                fechaRegistro: '2024/01/01',
                entregas: 4.47,
                especiales: 20,
                recogidas: 4.47,
                extras: 4.47,
                kilos: 0.073,
                recogidas: 4.47,
                supermercados: 4.47
            }
        ],
        
        servicios: [
            {
                dia: '01',
                entregas: 32,
                especiales: 0,
                extras: 1,
                kilos: 390,
                recogidas: 3,
                supermercados: 1,

                extras: [
                    {
                        exp_alb: [
                            'Exp: 23432/1',
                            'Exp: 45435/2',
                            'Alb: 123456'
                        ],
                        concepto: [
                            'palet de dos pisos y 39 cajas',
                            'palet a wurth 10 cubos de pintura',
                            'palet de 3 bultos grandes y pesados'
                        ]
                    }
                ],

                especiales: [
                    {
                        especial: [
                            'Exp: 23432/1, entrega especial',
                            'Exp: 45435/2, entrega con recogida especial'
                        ],
                        precio: [
                            20, 20
                        ]
                    }
                ]
            },
            {
                dia: '02',
                entregas: 28,
                especiales: 1,
                extras: 0,
                kilos: 130,
                recogidas: 2,
                supermercados: 0
            },
            {
                dia: '03',
                entregas: 35,
                especiales: 0,
                extras: 2,
                kilos: 270,
                recogidas: 1,
                supermercados: 3
            }

        ],
        
        observaciones: [
            {
                concepto: 'Especiales:',
                exp: [
                    'Exp: 23432/1, palet de dos pisos y 39 cajas',
                    'Exp: 45435/2, palet a wurth 10 cubos de pintura'
                ]
            },
            
            {
                concepto: 'Observaciones: sin asignar, rechazos u otros motivos',
                
                exp: [
                    'Exp: 23432/1',
                    'Exp: 45435/2'
                ],
                
                motivo: [
                    'firmar albaran',
                    'muchas cajas pesadas'
                ]
            },
        ]
    },

    {
        info: {
            email: 'test@test.com',
            user: 'Ulises'
        },

        datos: {
            factura_tipo: 'ordinaria',
            fecha_facturacion: '16/01/2024',
            fecha_vencimiento: '31/01/2024',
            numero_factura: '02/24'
        },

        estado: {
            total_factura: 3270,
            estado_factura: 1 /// 0 = en reparto, 1 = factura enviada, 2 = factura cobrada
        },

        receptor: {
            razonSocial: 'Rhenus Logistics SAU',
            cif: 'B123456789',
            domicilio: 'calle el papapote, 2',
            codigoPostal: '35008 - Las Palmas de G.C',
            alias: 'Rhenus',
        },

        emisor: {
            email: 'emisor@empresa.com',
            telefono: '123456789',
            razon_social: 'Nombre Apellidos',
            dni: "123456789A",
            domicilio: '',
            cp: "35000 - Las Palmas de Gran Canaria",
            logo: 'logo.png'
        },
        
        impuestos: [
            {
                base: '',
                igic: 3,
                irpf: -1
            }
        ],

        concepto: {
            concepto: 'Transporte y reparto de mercancias'
        },
        
        servicios: [
            {
                dia: '01',
                entregas: 32,
                especiales: 0,
                extras: 1,
                kilos: 390,
                recogidas: 3,
                supermercados: 1
            },
            {
                dia: '02',
                entregas: 28,
                especiales: 1,
                extras: 0,
                kilos: 130,
                recogidas: 2,
                supermercados: 0
            },
            {
                dia: '03',
                entregas: 35,
                especiales: 0,
                extras: 2,
                kilos: 270,
                recogidas: 1,
                supermercados: 3
            },
            {
                dia: '04',
                entregas: 32,
                especiales: 0,
                extras: 1,
                kilos: 390,
                recogidas: 3,
                supermercados: 1
            },
            {
                dia: '05',
                entregas: 28,
                especiales: 1,
                extras: 0,
                kilos: 130,
                recogidas: 2,
                supermercados: 0
            },
            {
                dia: '06',
                entregas: 35,
                especiales: 0,
                extras: 2,
                kilos: 270,
                recogidas: 1,
                supermercados: 3
            }
        ],

        precios: [
            {
                fechaRegistro: '2023/07/12',
                entregas: 4.35,
                recogidas: 4.35,
                especiales: 5
            }
        ],
        
        observaciones: [
            {
                concepto: 'Especiales:',
                exp: [
                    'Exp: 23432/1, palet de dos pisos y 39 cajas',
                    'Exp: 45435/2, palet a wurth 10 cubos de pintura'
                ]
            },
            
            {
                concepto: 'Observaciones: sin asignar, rechazos u otros motivos',
                
                exp: [
                    'Exp: 23432/1',
                    'Exp: 45435/2'
                ],
                
                motivo: [
                    'firmar albaran',
                    'muchas cajas pesadas'
                ]
            },
        ],
    },

    {
        info: {
            email: 'test2@test.com',
            user: 'Kiara',
            tipo: 'ordinaria' /// simplificada, proforma, rectificativa, electrónica, origen
        },

        datos: {
            factura_tipo: 'ordinaria',
            fecha_facturacion: '01/01/2024',
            fecha_vencimiento: '16/01/2024',
            numero_factura: '01/24'
        },

        estado: {
            total_factura: 1250,
            estado_factura: 1 /// 0 = en reparto, 1 = factura enviada, 2 = factura cobrada
        },

        receptor: {
            razonSocial: 'Hill Food S.L',
            cif: 'B123456789',
            domicilio: 'calle el papapote, 2',
            codigoPostal: '35008 - Las Palmas de G.C',
            alias: 'Hill Food',
        },

        emisor: {
            email: 'emisor@empresa.com',
            telefono: '123456789',
            razon_social: 'Nombre Apellidos',
            dni: "123456789A",
            domicilio: '',
            cp: "35000 - Las Palmas de Gran Canaria",
            logo: 'logo.png'
        },
        
        impuestos: [
            {
                base: '',
                igic: 3,
                irpf: -1
            }
        ],

        concepto: {
            concepto: 'Transporte y reparto de mercancias'
        },
        
        servicios: [
            {
                dia: '01',
                entregas: 32,
                especiales: 0,
                extras: 1,
                kilos: 390,
                recogidas: 3,
                supermercados: 1
            },
            {
                dia: '02',
                entregas: 28,
                especiales: 1,
                extras: 0,
                kilos: 130,
                recogidas: 2,
                supermercados: 0
            }
        ],

        precios: [
            {
                fechaRegistro: '2023/07/12',
                entregas: 4.35,
                recogidas: 4.35,
                especiales: 5
            }
        ],
        
        observaciones: [
            {
                concepto: 'Especiales:',
                exp: [
                    'Exp: 23432/1, palet de dos pisos y 39 cajas',
                    'Exp: 45435/2, palet a wurth 10 cubos de pintura'
                ]
            },
            
            {
                concepto: 'Observaciones: sin asignar, rechazos u otros motivos',
                
                exp: [
                    'Exp: 23432/1',
                    'Exp: 45435/2'
                ],
                
                motivo: [
                    'firmar albaran',
                    'muchas cajas pesadas'
                ]
            },
        ],
    },

    {
        info: {
            email: 'test@test.com',
            user: 'Ulises'
        },

        datos: {
            factura_tipo: 'ordinaria',
            fecha_facturacion: '01/04/2024',
            fecha_vencimiento: '16/04/2024',
            numero_factura: '03/24'
        },

        estado: {
            total_factura: 2300,
            estado_factura: 2 /// 0 = en reparto, 1 = factura enviada, 2 = factura cobrada
        },

        receptor: {
            razonSocial: 'Hill Food S.L',
            cif: 'B123456789',
            domicilio: 'calle el papapote, 2',
            codigoPostal: '35008 - Las Palmas de G.C',
            alias: 'Hill Food',
        },

        emisor: {
            email: 'emisor@empresa.com',
            telefono: '123456789',
            razon_social: 'Nombre Apellidos',
            dni: "123456789A",
            domicilio: '',
            cp: "35000 - Las Palmas de Gran Canaria",
            logo: 'logo.png'
        },

        concepto: {
            concepto: 'Transporte y reparto de mercancias'
        },
        
        impuestos: [
            {
                base: '',
                igic: 3,
                irpf: -1
            }
        ],
        
        servicios: [
            {
                dia: '01',
                entregas: 32,
                especiales: 0,
                extras: 1,
                kilos: 390,
                recogidas: 3,
                supermercados: 1
            },
            {
                dia: '02',
                entregas: 28,
                especiales: 1,
                extras: 0,
                kilos: 130,
                recogidas: 2,
                supermercados: 0
            },
            {
                dia: '03',
                entregas: 35,
                especiales: 0,
                extras: 2,
                kilos: 270,
                recogidas: 1,
                supermercados: 3
            },
            {
                dia: '04',
                entregas: 32,
                especiales: 0,
                extras: 1,
                kilos: 390,
                recogidas: 3,
                supermercados: 1
            },
            {
                dia: '05',
                entregas: 28,
                especiales: 1,
                extras: 0,
                kilos: 130,
                recogidas: 2,
                supermercados: 0
            },
            
        ],

        precios: [
            {
                fechaRegistro: '2023/07/12',
                entregas: 4.35,
                recogidas: 4.35,
                especiales: 5
            }
        ],
        
        observaciones: [
            {
                concepto: 'Especiales:',
                exp: [
                    'Exp: 23432/1, palet de dos pisos y 39 cajas',
                    'Exp: 45435/2, palet a wurth 10 cubos de pintura'
                ]
            },
            
            {
                concepto: 'Observaciones: sin asignar, rechazos u otros motivos',
                
                exp: [
                    'Exp: 23432/1',
                    'Exp: 45435/2'
                ],
                
                motivo: [
                    'firmar albaran',
                    'muchas cajas pesadas'
                ]
            },
        ],

    }
]

export const emisor = [
    {
        alias:'Ulises',
        email: 'emisor@empresa.com',
        telefono: '123456789',
        razon_social: 'Nombre Apellidos',
        dni: "123456789A",
        domicilio: '',
        cp: "35019 - Las Palmas de Gran Canaria",
        logo: 'logo.png'
    },
    
    {
        alias: 'Kiara',
        email: 'emisor@empresa.com',
        telefono: '987654321',
        razon_social: 'Nombre Apellidos',
        dni: "33558899N",
        domicilio: '',
        cp: "35016 - Las Palmas de Gran Canaria",
        logo: 'logo.png'
    },
]

export const receptoress = [
    {
        user: 'Ulises',
        alias: "Rhenus",
        cif: "B123456789",
        codigoPostal: "35008 - Las Palmas de G.C",
        domicilio: "calle el papapote, 2",
        razonSocial: "Rhenus Logistics SAU",

        impuestos_fecha_registro: [
            '2023/05/01'
        ],

        impuestos: [
            {
                base: '',
                igic: 3,
                irpf: -1
            }
        ],

        precios_fecha_registro: [
            '2024/01/01'
        ],

        precios: [
            {
                entregas: 4.47,
                especiales: 20,
                recogidas: 4.47,
                extras: 4.47,
                kilos: 0.073,
                recogidas: 4.47,
                supermercados: 4.47
            }
        ]
    },
    {
        user: 'Ulises',
        alias: "HillFood",
        cif: "B98712345",
        codigoPostal: "38010 - Las Palmas de G.C",
        domicilio: "Av del atlantico, 11",
        razonSocial: "Hill Food S.A",

        impuestos_fecha_registro: [
            '2023/05/01'
        ],

        impuestos: [
            {
                base: '',
                igic: 3,
                irpf: -1
            }
        ],

        precios_fecha_registro: [
            '2024/01/01'
        ],

        precios: [
            {
                entregas: 4.47,
                especiales: 20,
                recogidas: 4.47,
                extras: 4.47,
                kilos: 0.073,
                recogidas: 4.47,
                supermercados: 4.47
            }
        ]
    },
    {
        user: 'Kiara',
        alias: "Vectio S.L",
        cif: "B98712345",
        codigoPostal: "38010 - Las Palmas de G.C",
        domicilio: "Av del atlantico, 11",
        razonSocial: "Vectio S.L",

        impuestos_fecha_registro: [
            '2023/05/01'
        ],

        impuestos: [
            {
                base: '',
                igic: 3,
                irpf: -1
            }
        ],

        precios_fecha_registro: [
            '2024/01/01'
        ],

        precios: [
            {
                entregas: 4.47,
                especiales: 20,
                recogidas: 4.47,
                extras: 4.47,
                kilos: 0.073,
                recogidas: 4.47,
                supermercados: 4.47
            }
        ]
    }
]