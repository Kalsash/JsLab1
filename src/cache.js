class Cache
{
    constructor () 
    {
        this.data = new Map()
        this.statisticsList = []
    }
    set(key, value, numberOfQueries=1) 
    {
        this.data.set(key, {value: value, numberOfQueries: numberOfQueries });
        this.statisticsList.push(`set ${key}, ${value}, ${numberOfQueries}`)
    }
    get(key) 
    {
        const val = this.data.get(key)
        if (val === undefined) { return null }

        if (val.numberOfQueries === 0) 
        {
            this.data.delete(key)
            return null;
        }
        val.numberOfQueries -= 1;
        this.statisticsList.push(`get ${key} ${val.numberOfQueries}`)
        return val.value
    }
    statistics() { return this.statisticsList;}
}
export {Cache}