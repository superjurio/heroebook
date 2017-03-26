
export class ValueUtils {

    static isJSON(text) {
        try {
            JSON.parse(text);
            return true;
        }
        catch (error) {
            return false;
        }
    }
}