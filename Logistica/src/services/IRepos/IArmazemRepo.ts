export default interface IArmazemRepo {
    findAll(): Promise<any[]>;
}