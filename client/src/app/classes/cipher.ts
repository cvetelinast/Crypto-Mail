class Cipher { 

    constructor() {
    }
    
    replace(input: string, key: number) : string {
        return input.replace(/([a-z])/g, 
            ($1) => String.fromCharCode(($1.charCodeAt(0) + key + 26 - 97) % 26 + 97)
            ).replace(/([A-Z])/g, 
            ($1) => String.fromCharCode(($1.charCodeAt(0) + key + 26 - 65) % 26 + 65));
    }
    encode(input:string) : string {
        return this.replace(input, 3);
    }
    decode(input:string) : string {
        return this.replace(input, -3);
    }
}
export = Cipher;