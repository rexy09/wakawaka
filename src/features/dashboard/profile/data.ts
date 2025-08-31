import { useMemo } from 'react';

export interface CountryData {
    code: string;
    name: string;
}

export interface CurrencyData {
    code: string;
    name: string;
    symbol: string;
}

export const useCountriesAndCurrencies = () => {
    const countries = useMemo((): CountryData[] => {
        return [
            // Africa
            { code: "NG", name: "Nigeria" },
            { code: "KE", name: "Kenya" },
            { code: "ZA", name: "South Africa" },
            { code: "GH", name: "Ghana" },
            { code: "EG", name: "Egypt" },
            { code: "ET", name: "Ethiopia" },
            { code: "TZ", name: "Tanzania" },
            { code: "MA", name: "Morocco" },
            { code: "UG", name: "Uganda" },
            { code: "SN", name: "Senegal" },
            { code: "RW", name: "Rwanda" },

            // Americas
            { code: "US", name: "United States" },
            { code: "CA", name: "Canada" },
            { code: "MX", name: "Mexico" },
            { code: "BR", name: "Brazil" },
            { code: "AR", name: "Argentina" },
            { code: "CO", name: "Colombia" },
            { code: "CL", name: "Chile" },
            { code: "PE", name: "Peru" },
            { code: "JM", name: "Jamaica" },

            // Asia & Middle East
            { code: "CN", name: "China" },
            { code: "IN", name: "India" },
            { code: "JP", name: "Japan" },
            { code: "KR", name: "South Korea" },
            { code: "ID", name: "Indonesia" },
            { code: "PH", name: "Philippines" },
            { code: "SG", name: "Singapore" },
            { code: "MY", name: "Malaysia" },
            { code: "AE", name: "United Arab Emirates" },
            { code: "SA", name: "Saudi Arabia" },
            { code: "PK", name: "Pakistan" },
            { code: "VN", name: "Vietnam" },
            { code: "TH", name: "Thailand" },
            { code: "IL", name: "Israel" },
            { code: "TR", name: "Turkey" },

            // Europe
            { code: "GB", name: "United Kingdom" },
            { code: "DE", name: "Germany" },
            { code: "FR", name: "France" },
            { code: "IT", name: "Italy" },
            { code: "ES", name: "Spain" },
            { code: "NL", name: "Netherlands" },
            { code: "SE", name: "Sweden" },
            { code: "CH", name: "Switzerland" },
            { code: "RU", name: "Russia" },
            { code: "PL", name: "Poland" },
            { code: "UA", name: "Ukraine" },
            { code: "NO", name: "Norway" },
            { code: "IE", name: "Ireland" },
            { code: "PT", name: "Portugal" },

            // Oceania
            { code: "AU", name: "Australia" },
            { code: "NZ", name: "New Zealand" },
            { code: "FJ", name: "Fiji" },

            // Additional countries
            { code: "AO", name: "Angola" },
            { code: "CM", name: "Cameroon" },
            { code: "LB", name: "Lebanon" },
            { code: "QA", name: "Qatar" },
            { code: "BH", name: "Bahrain" },
            { code: "KW", name: "Kuwait" },
            { code: "OM", name: "Oman" },
        ].sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const currencies = useMemo((): CurrencyData[] => {
        return [
            // Major world currencies
            { code: "USD", name: "US Dollar", symbol: "$" },
            { code: "EUR", name: "Euro", symbol: "€" },
            { code: "GBP", name: "British Pound", symbol: "£" },
            { code: "JPY", name: "Japanese Yen", symbol: "¥" },
            { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
            { code: "CHF", name: "Swiss Franc", symbol: "CHF" },

            // African currencies
            { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
            { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
            { code: "ZAR", name: "South African Rand", symbol: "R" },
            { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
            { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
            { code: "MAD", name: "Moroccan Dirham", symbol: "MAD" },
            { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
            { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
            { code: "XOF", name: "West African CFA Franc", symbol: "CFA" },
            { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" },
            { code: "ETB", name: "Ethiopian Birr", symbol: "Br" },
            { code: "RWF", name: "Rwandan Franc", symbol: "RF" },
            { code: "AOA", name: "Angolan Kwanza", symbol: "Kz" },

            // American currencies
            { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
            { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
            { code: "BRL", name: "Brazilian Real", symbol: "R$" },
            { code: "ARS", name: "Argentine Peso", symbol: "AR$" },
            { code: "COP", name: "Colombian Peso", symbol: "COL$" },
            { code: "CLP", name: "Chilean Peso", symbol: "CLP$" },
            { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
            { code: "JMD", name: "Jamaican Dollar", symbol: "J$" },

            // Asian & Middle Eastern currencies
            { code: "INR", name: "Indian Rupee", symbol: "₹" },
            { code: "KRW", name: "South Korean Won", symbol: "₩" },
            { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
            { code: "PHP", name: "Philippine Peso", symbol: "₱" },
            { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
            { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
            { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
            { code: "SAR", name: "Saudi Riyal", symbol: "SR" },
            { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
            { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
            { code: "THB", name: "Thai Baht", symbol: "฿" },
            { code: "ILS", name: "Israeli New Shekel", symbol: "₪" },
            { code: "TRY", name: "Turkish Lira", symbol: "₺" },
            { code: "QAR", name: "Qatari Riyal", symbol: "QR" },
            { code: "BHD", name: "Bahraini Dinar", symbol: "BD" },
            { code: "KWD", name: "Kuwaiti Dinar", symbol: "KD" },
            { code: "OMR", name: "Omani Rial", symbol: "OMR" },

            // European currencies
            { code: "RUB", name: "Russian Ruble", symbol: "₽" },
            { code: "PLN", name: "Polish Złoty", symbol: "zł" },
            { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
            { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
            { code: "SEK", name: "Swedish Krona", symbol: "kr" },
            { code: "DKK", name: "Danish Krone", symbol: "kr" },
            { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
            { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },

            // Oceania currencies
            { code: "AUD", name: "Australian Dollar", symbol: "A$" },
            { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
            { code: "FJD", name: "Fijian Dollar", symbol: "FJ$" },
        ].sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const countryCurrencyMap = useMemo(() => ({
        // Africa
        NG: "NGN", KE: "KES", ZA: "ZAR", GH: "GHS", EG: "EGP", MA: "MAD",
        UG: "UGX", TZ: "TZS", ET: "ETB", RW: "RWF", SN: "XOF", AO: "AOA", CM: "XAF",
        // Americas
        US: "USD", CA: "CAD", MX: "MXN", BR: "BRL", AR: "ARS", CO: "COP",
        CL: "CLP", PE: "PEN", JM: "JMD",
        // Asia & Middle East
        CN: "CNY", IN: "INR", JP: "JPY", KR: "KRW", ID: "IDR", PH: "PHP",
        SG: "SGD", MY: "MYR", AE: "AED", SA: "SAR", PK: "PKR", VN: "VND",
        TH: "THB", IL: "ILS", TR: "TRY", QA: "QAR", BH: "BHD", KW: "KWD", OM: "OMR", LB: "LBP",
        // Europe
        GB: "GBP", DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR",
        SE: "SEK", CH: "CHF", RU: "RUB", PL: "PLN", UA: "UAH", NO: "NOK",
        IE: "EUR", PT: "EUR", DK: "DKK", CZ: "CZK", HU: "HUF",
        // Oceania
        AU: "AUD", NZ: "NZD", FJ: "FJD",
    }), []);

    const getCurrencyForCountry = useMemo(() => {
        return (countryCode: string): CurrencyData | null => {
            const currencyCode = countryCurrencyMap[countryCode as keyof typeof countryCurrencyMap];
            if (!currencyCode) return null;

            const currency = currencies.find((c) => c.code === currencyCode);
            return currency || {
                code: currencyCode,
                name: currencyCode,
                symbol: currencyCode,
            };
        };
    }, [currencies, countryCurrencyMap]);

    return {
        countries,
        currencies,
        getCurrencyForCountry,
    };
};
