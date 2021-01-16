import { request } from '@/plugins/request' 

// 获取公共文章列表
export const getArticles = params => {
    // params 是可选的
    return request({
        method: 'GET',
        url: '/api/articles',
        params
    }) 
}

// 发表文章
export const publishArticle = data => {
    return request({
        method: 'POST',
        url: '/api/articles',
        data
    }) 
}

// 获取关注的用户文章列表
export const getFeedArticles = params => {
    // params 是可选的
    return request({
        method: 'GET',
        url: '/api/articles/feed',
        params
    }) 
}

// 添加点赞
export const addFavorite = slug => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/favorite`
    }) 
}

// 取消点赞
export const deleteFavorite = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/favorite`
    }) 
}

// 获取文章详情
export const getArticle = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}`
    }) 
}

// 删除文章
export const deleteArticle = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}`
    }) 
}

// 获取文章评论
export const getComments = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}/comments`
    }) 
}


// 增加评论
export const addComments = (data, slug) => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/comments`,
        data
    }) 
}

// 删除评论
export const deleteComments = (slug, id) => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/comments/${id}`
    }) 
}


// 设置 Follow
export const setFollow = username => {
    return request({
        method: "POST",
        url: `/api/profiles/${username}/follow`
    })
} 

// 删除 Follow
export const deleteFollow = username => {
    return request({
        method: "DELETE",
        url: `/api/profiles/${username}/follow`
    })
} 


