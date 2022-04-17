const app_name = 'peosd2'
exports.buildPath = 
function buildPath(route)
{
    if (process.env.NODE_ENV === 'production') 
    {
        return 'http://' + app_name +  '.xyz:8080/' + route;
    }
    else
    {        
        return 'http://localhost:8080/' + route;
    }
}
