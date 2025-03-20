import Category from "../models/category.model";


class CategoryService {
    public async findAll() {
        const categories = await Category.find();

        let responseCategoriesDTO: any[] = [];
        categories.forEach((category: any) => {
            const responseCategoryDTO: any = {
                id: category._id,
                name: category.name,
                image: category.image,
            };


            responseCategoriesDTO.push(responseCategoryDTO);
        });

        return responseCategoriesDTO;

    }
}

export default new CategoryService();