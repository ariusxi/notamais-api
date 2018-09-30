'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    xmlns: {
        type: String,
        required: true
    },
    infNFE: {
        Id: {
            type: String,
            required: true
        },
        versao: {
            type: String,
            required: true
        },
        ide: {
            cUF: {
                type: String,
                required: true
            },
            cNF:  {
                type: String,
                required: true
            },
            natOp:  {
                type: String,
                required: true
            },
            indPag:  {
                type: String,
                required: true
            },
            mod:  {
                type: String,
                required: true
            },
            serie:  {
                type: String,
                required: true
            },
            nNF:  {
                type: String,
                required: true
            },
            dhEmi:  {
                type: String,
                required: true
            },
            dhSaiEnt:  {
                type: String,
                required: true
            },
            tpNF:  {
                type: String,
                required: true
            },
            idDest:  {
                type: String,
                required: true
            },
            cMunFG:  {
                type: String,
                required: true
            },
            tpImp:  {
                type: String,
                required: true
            },
            tpEmis:  {
                type: String,
                required: true
            },
            cDV:  {
                type: String,
                required: true
            },
            tpAmb:  {
                type: String,
                required: true
            },
            finNFe:   {
                type: String,
                required: true
            },
            indFinal:  {
                type: String,
                required: true
            },
            indPres:  {
                type: String,
                required: true
            },
            procEmi:  {
                type: String,
                required: true
            },
            verProc:  {
                type: String,
                required: true
            }
        },
        emit: {
            CNPJ:  {
                type: String,
                required: true
            },
            xNome:  {
                type: String,
                required: true
            },
            enderEmit: {
                xLgr:  {
                    type: String,
                    required: true
                },
                nro:  {
                    type: String,
                    required: true
                },
                xBairro:  {
                    type: String,
                    required: true
                },
                cMun:  {
                    type: String,
                    required: true
                },
                xMun:  {
                    type: String,
                    required: true
                },
                UF: {
                    type: String,
                    required: true
                },
                CEP: {
                    type: String,
                    required: true
                },
                cPais: {
                    type: String,
                    required: true
                },
                xPais: {
                    type: String,
                    required: true
                },
            },
            IE: {
                type: String,
                required: true
            },
            CRT: {
                type: String,
                required: true
            },
        },
        dest: {
            CNPJ: {
                type: String,
                required: true
            },
            xNome: {
                type: String,
                required: true
            },
            enderDest: {
                xLgr: {
                    type: String,
                    required: true
                },
                nro: {
                    type: String,
                    required: true
                },
                xBairro: {
                    type: String,
                    required: true
                },
                cMun:  {
                    type: String,
                    required: true
                },
                xMun: {
                    type: String,
                    required: true
                },
                UF: {
                    type: String,
                    required: true
                },
                CEP: {
                    type: String,
                    required: true
                },
                cPais: {
                    type: String,
                    required: true
                },
                xPais: {
                    type: String,
                    required: true
                },
            },
            indIEDest: {
                type: String,
                required: true
            },
            IE: {
                type: String,
                required: true
            }
        },
        det: [{
            nItem: {
                type: String,
                required: true
            },
            prod: {
                cProd: {
                    type: String,
                    required: true
                },
                cEAN: {
                    type: Array,
                    required: true
                },
                xProd: {
                    type: String,
                    required: true
                },
                NCM: {
                    type: String,
                    required: true
                },
                CFOP: {
                    type: String,
                    required: true
                },
                uCom: {
                    type: String,
                    required: true
                },
                qCom: {
                    type: String,
                    required: true
                },
                vUnCom: {
                    type: String,
                    required: true
                },
                vProd: {
                    type: String,
                    required: true
                },
                cEANTrib: {
                    type: Array,
                    required: true
                },
                uTrib: {
                    type: String,
                    required: true
                },
                qTrib: {
                    type: String,
                    required: true
                },
                vUnTrib: {
                    type: String,
                    required: true
                },
                indTot: {
                    type: String,
                    required: true
                }
            },
            imposto: {
                vTotTrib: {
                    type: String,
                    required: true
                },
                ICMS: {
                    ICMS00: {
                        orig: {
                            type: String,
                            required: true
                        },
                        CST: {
                            type: String,
                            required: true
                        },
                        modBC: {
                            type: String,
                            required: true
                        },
                        vBC: {
                            type: String,
                            required: true
                        },
                        pICMS: {
                            type: String,
                            required: true
                        },
                        vICMS: {
                            type: String,
                            required: true
                        }
                    }
                },
                IPI: {
                    cEnq: {
                        type: String,
                        required: true
                    },
                    IPITrib: {
                        CST: {
                            type: String,
                            required: true
                        },
                        vIPI: {
                            type: String,
                            required: true
                        }
                    }
                },
                PIS: {
                    PISNT: {
                        CST: {
                            type: String,
                            required: true
                        }
                    }
                },
                COFINSST: {
                    vBC: {
                        type: String,
                        required: true
                    },
                    pCOFINS: {
                        type: String,
                        required: true
                    },
                    qBCProd: {
                        type: Array,
                        required: true
                    },
                    vAliqProd: {
                        type: Array,
                        required: true
                    },
                    vCOFINS: {
                        type: String,
                        required: true
                    }
                }
            }
        }],
        total:  {
            ICMSTot: {
                vBC: {
                    type: String,
                    required: true
                },
                vICMS: {
                    type: String,
                    required: true
                },
                vICMSDeson: {
                    type: String,
                    required: true
                },
                vBCST: {
                    type: String,
                    required: true
                },
                vST: {
                    type: String,
                    required: true
                },
                vProd: {
                    type: String,
                    required: true
                },
                vFrete: {
                    type: String,
                    required: true
                },
                vSeg: {
                    type: String,
                    required: true
                },
                vDesc: {
                    type: String,
                    required: true
                },
                vII: {
                    type: String,
                    required: true
                },
                vIPI: {
                    type: String,
                    required: true
                },
                vPIS: {
                    type: String,
                    required: true
                },
                vCOFINS: {
                    type: String,
                    required: true
                },
                vOutro: {
                    type: String,
                    required: true
                },
                vNF: {
                    type: String,
                    required: true
                },
                vTotTrib: {
                    type: String,
                    required: true
                }
            }
        },
        transp: {
            modFrete:{
                type: String,
                required: true
            },
            vol: {
                qVol: {
                    type: String,
                    required: true
                },
                esp: {
                    type: String,
                    required: true
                },
                marca: {
                    type: String,
                    required: true
                },
                nVol: {
                    type: String,
                    required: true
                },
                pesoL: {
                    type: String,
                    required: true
                },
                pesoB: {
                    type: String,
                    required: true
                }
            }
        },
        cobr: {
            fat: {
                nFat: {
                    type: String,
                    required: true
                },
                vOrig: {
                    type: String,
                    required: true
                },
                vLiq: {
                    type: String,
                    required: true
                }
            },
            dup: {
                nDup: {
                    type: String,
                    required: true
                },
                dVenc: {
                    type: String,
                    required: true
                },
                vDup: {
                    type: String,
                    required: true
                }
            }
        }
    }
});

module.exports = mongoose.model('NFe', schema);