import Color from "../models/color.model";


class ColorService {
    public async findAll() {
        const colors = await Color.find();

        let responseColorDTOS: any[] = [];
        colors.forEach((color: any) => {
            const responseColorDTO: any = {
                id: color._id,
                name: color.name,
                code : color.code
            };


            responseColorDTOS.push(responseColorDTO);
        });

        return responseColorDTOS;

    }
}

export default new ColorService();